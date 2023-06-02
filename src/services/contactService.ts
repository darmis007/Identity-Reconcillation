import db from '../database/knex';
import { Contact, LinkPrecedence } from '../models/contact';
import logger from '../utils/logger';

const contactService = {
    fetchContacts: async (email: string | undefined, phoneNumber: string | undefined): Promise<{
        primaryContacts: Contact[];
        secondaryContacts: Contact[];
        numPrimaryContacts: number;
    }> => {
        try {
            let query = db('Contact');
    
            if (email) {
                query = query.where('email', email);
            }
            if (phoneNumber) {
                query = query.orWhere('phoneNumber', phoneNumber);
            }
    
            const contacts = await query;
    
            const primaryContacts: Contact[] = [];
            const secondaryContacts: Contact[] = [];
    
            for (const contact of contacts) {
                if (contact.linkPrecedence === LinkPrecedence.Primary) {
                    primaryContacts.push(contact);
                } else if (contact.linkPrecedence === LinkPrecedence.Secondary) {
                    secondaryContacts.push(contact);
                }
            }
    
            // Sort primaryContacts in ascending order of createdAt
            primaryContacts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
            logger.info('Contacts fetched successfully:', contacts);
            return {
                primaryContacts,
                secondaryContacts,
                numPrimaryContacts: primaryContacts.length,
            };
        } catch (error) {
            logger.error('An error occurred while fetching contacts:', error);
            throw error;
        }
    },    

    createContact: async (
        email: string | null,
        phoneNumber: string | null,
        linkPrecedence: LinkPrecedence,
        linkedId?: number | null
      ): Promise<Contact> => {
        try {
          // Check if a contact with the same email or phoneNumber already exists
          const existingContact = await db('Contact')
            .where((builder) => {
                if (email && phoneNumber) {
                // Search with both email and phoneNumber
                builder.where('email', email).andWhere('phoneNumber', phoneNumber);
                } else if (email) {
                // Search with email only
                builder.where('email', email);
                } else if (phoneNumber) {
                // Search with phoneNumber only
                builder.where('phoneNumber', phoneNumber);
                }
            })
            .first();

            if (existingContact) {
            // Contact already exists, return the existing contact
            logger.info('Contact already exists:', existingContact);
            return existingContact;
            }
    
          let contact: Contact;
    
          if (linkedId !== undefined) {
            const [contactId] = await db('Contact').insert({
              email: email || null,
              phoneNumber: phoneNumber || null,
              linkPrecedence,
              linkedId
            });
    
            contact = {
              id: contactId,
              email: email || null,
              phoneNumber: phoneNumber || null,
              linkedId,
              linkPrecedence,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null
            };
          } else {
            const [contactId] = await db('Contact').insert({
              email: email || null,
              phoneNumber: phoneNumber || null,
              linkPrecedence
            });
    
            contact = {
              id: contactId,
              email: email || null,
              phoneNumber: phoneNumber || null,
              linkedId: null,
              linkPrecedence,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null
            };
          }
    
          logger.info('Contact created successfully:', contact);
          return contact;
        } catch (error) {
          logger.error('An error occurred while creating a contact:', error);
          throw error;
        }
      }
    
  ,

  updateContact: async (
    contact: Contact,
    linkPrecedence: LinkPrecedence,
    linkedId: number | null
  ): Promise<Contact> => {
    try {
      await db('Contact')
        .update({ linkPrecedence, linkedId })
        .where('id', contact.id)
        .orWhere(function () {
          this.whereNull('email').whereNull('phoneNumber');
        });
  
      const updatedContact = await db('Contact').where('id', contact.id).first();
  
      logger.info('Contact updated successfully:', updatedContact);
  
      return updatedContact;
    } catch (error) {
      logger.error('An error occurred while updating a contact:', error);
      throw error;
    }
  }  
}

export default contactService;
