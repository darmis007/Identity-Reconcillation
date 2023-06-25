import { Request, Response } from 'express';
import contactService from '../services/contactService';
import { Contact, LinkPrecedence } from '../models/contact';
import logger from '../utils/logger';

const identityController = {
  identify: async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    // Check if at least one of email or phoneNumber is provided
    if (!email && !phoneNumber) {
      logger.error('At least one of email or phoneNumber is required.');
      return res.status(400).json({ error: 'At least one of email or phoneNumber is required.' });
    }

    try {
      // Fetch contacts based on email and phoneNumber
      const { primaryContacts, secondaryContacts, numPrimaryContacts } = await contactService.fetchContacts(
        email,
        phoneNumber
      );

      let primaryContact: Contact | undefined = undefined;
      let secondaryContact: Contact | undefined = undefined;

      logger.info(`Number of Primary Contacts: ${numPrimaryContacts}`);

      if (numPrimaryContacts === 0) {
        // Create a new primary contact if no primary contacts are found
        primaryContact = await contactService.createContact(email, phoneNumber, LinkPrecedence.Primary);
        logger.info('New primary contact created:', primaryContact);
      } else if (numPrimaryContacts === 1) {
        // Use the single primary contact found
        primaryContact = primaryContacts[0];
        // Create a new secondary contact linked to the primary contact
        secondaryContact = await contactService.createContact(
          email,
          phoneNumber,
          LinkPrecedence.Secondary,
          primaryContact.id
        );
        secondaryContacts.push(secondaryContact);
        logger.info('New secondary contact created:', secondaryContact);
      } else if (numPrimaryContacts > 1) {
        // Convert the primary contacts created later to secondary contacts
        for (let i = 1; i < numPrimaryContacts; i++) {
          const newSecondaryContact = primaryContacts[i];
          // Set the linkedId of the new secondary contact to the first primary contact
          secondaryContact = await contactService.updateContact(
            newSecondaryContact,
            LinkPrecedence.Secondary,
            primaryContacts[0].id
          );
          secondaryContacts.push(secondaryContact);
          logger.info('Primary contact updated to following secondary contact:', secondaryContact);
        }

          // Update linkedId of secondary contacts linked to the primary contact being updated
          for (const secondary of secondaryContacts) {
            if (secondary.linkedId !== primaryContacts[0].id) {
              await contactService.updateContact(secondary, LinkPrecedence.Secondary, primaryContacts[0].id);
              logger.info('LinkedId updated for secondary contact:', secondary);
            }
          }
          primaryContact = primaryContacts[0]
        }

      // Prepare the response payload with contact details
      const responsePayload = {
        contact: {
          primaryContactId: primaryContact?.id,
          emails: Array.from(new Set([primaryContact?.email, ...secondaryContacts.map(contact => contact.email)]))
            .filter(email => email !== null),
          phoneNumbers: Array.from(
            new Set([primaryContact?.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)])
          ).filter(phoneNumber => phoneNumber !== null),
          secondaryContactIds: Array.from(new Set(secondaryContacts.map(contact => contact.id)))
            .filter(id => id !== null && id !== primaryContact?.id),
        },
      };

      logger.info('Contact identified successfully:', responsePayload);
      res.status(200).json(responsePayload);
    } catch (error) {
      logger.error('An error occurred while identifying the contact:', error);
      res.status(500).json({ error: 'An error occurred while identifying the contact.' });
    }
  },
};

export default identityController;
