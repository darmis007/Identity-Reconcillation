const request = require('supertest');
const app = require('../app');
const contactService = require('../services/contactService');

// Mock the contactService module
jest.mock('../services/contactService', () => ({
  fetchContacts: jest.fn(),
  createContact: jest.fn(),
  updateContact: jest.fn(),
}));

// Test the IdentityController
describe('IdentityController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('identify', () => {
    it('should return an error if neither email nor phoneNumber is provided', async () => {
      const response = await request(app).post('/identity/identify').send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'At least one of email or phoneNumber is required.',
      });
    });

    it('should create a new primary contact if no contacts are found', async () => {
      contactService.fetchContacts.mockResolvedValueOnce({
        primaryContacts: [],
        secondaryContacts: [],
        numPrimaryContacts: 0,
      });
      contactService.createContact.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        phoneNumber: null,
        linkedId: null,
        linkPrecedence: 'Primary',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const response = await request(app).post('/identity/identify').send({ email: 'test@example.com' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        contact: {
          primaryContactId: 1,
          emails: ['test@example.com'],
          phoneNumbers: [],
          secondaryContactIds: [],
        },
      });
    });

    it('should create a new secondary contact if one primary contact is found', async () => {
      contactService.fetchContacts.mockResolvedValueOnce({
        primaryContacts: [
          {
            id: 1,
            email: 'test@example.com',
            phoneNumber: null,
            linkedId: null,
            linkPrecedence: 'Primary',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        secondaryContacts: [],
        numPrimaryContacts: 1,
      });
      contactService.createContact.mockResolvedValueOnce({
        id: 2,
        email: 'test@example.com',
        phoneNumber: '1234567890',
        linkedId: 1,
        linkPrecedence: 'Secondary',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const response = await request(app)
        .post('/identity/identify')
        .send({ email: 'test@example.com', phoneNumber: '1234567890' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        contact: {
          primaryContactId: 1,
          emails: ['test@example.com'],
          phoneNumbers: ['1234567890'],
          secondaryContactIds: [2],
        },
      });
    });

    it('should turn a primary contact into secondary if linkedId is provided', async () => {
      contactService.fetchContacts.mockResolvedValueOnce({
        primaryContacts: [
          {
            id: 11,
            email: 'george@hillvalley.edu',
            phoneNumber: '919191',
            linkedId: null,
            linkPrecedence: 'primary',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          {
            id: 27,
            email: 'biffsucks@hillvalley.edu',
            phoneNumber: '717171',
            linkedId: null,
            linkPrecedence: 'primary',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        secondaryContacts: [],
        numPrimaryContacts: 2,
      });
      contactService.updateContact.mockResolvedValueOnce({
        id: 27,
        email: 'biffsucks@hillvalley.edu',
        phoneNumber: '717171',
        linkedId: 11,
        linkPrecedence: 'secondary',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const response = await request(app)
        .post('/identity/identify')
        .send({ email: 'george@hillvalley.edu', phoneNumber: '717171' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        contact: {
          primaryContactId: 11,
          emails: ['george@hillvalley.edu', 'biffsucks@hillvalley.edu'],
          phoneNumbers: ['919191', '717171'],
          secondaryContactIds: [27],
        },
      });
    });

    it('should return the same response for multiple requests with different email and phoneNumber', async () => {
      contactService.fetchContacts.mockResolvedValueOnce({
        primaryContacts: [
          {
            id: 1,
            email: 'lorraine@hillvalley.edu',
            phoneNumber: null,
            linkedId: null,
            linkPrecedence: 'primary',
            createdAt: new Date("2023-04-01 00:00:00.374+00"),
            updatedAt: new Date("2023-04-01 00:00:00.374+00"),
            deletedAt: null,
          },
        ],
        secondaryContacts: [
          {
            id: 23,
            email: 'mcfly@hillvalley.edu',
            phoneNumber: '123456',
            linkedId: 1,
            linkPrecedence: 'secondary',
            createdAt: new Date("2023-04-20 05:30:00.11+00"),
            updatedAt: new Date("2023-04-20 05:30:00.11+00"),
            deletedAt: null,
          },
        ],
        numPrimaryContacts: 1,
      });

      contactService.createContact.mockResolvedValueOnce({
        id: 23,
        email: 'mcfly@hillvalley.edu',
        phoneNumber: '123456',
        linkedId: 1,
        linkPrecedence: 'secondary',
        createdAt: new Date("2023-04-20 05:30:00.11+00"),
        updatedAt: new Date("2023-04-20 05:30:00.11+00"),
        deletedAt: null,
      })

      const response1 = await request(app)
        .post('/identity/identify')
        .send({ email: 'mcfly@hillvalley.edu', phoneNumber: '123456' });
      expect(response1.status).toBe(200);
      expect(response1.body).toEqual({
        contact: {
          primaryContactId: 1,
          emails: ["lorraine@hillvalley.edu","mcfly@hillvalley.edu"],
          phoneNumbers: ['123456'],
          secondaryContactIds: [23],
        },
      });
    });
  });
});
