enum LinkPrecedence {
    Primary = 'primary',
    Secondary = 'secondary',
  }
  
  interface Contact {
    id: number;
    phoneNumber: string | null;
    email: string | null;
    linkedId: number | null;
    linkPrecedence: LinkPrecedence;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }
  
  export { Contact, LinkPrecedence };
  