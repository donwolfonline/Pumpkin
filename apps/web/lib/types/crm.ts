export type ContactStatus = 'active' | 'inactive' | 'lead' | 'archived';
export type ContactType = 'client' | 'partner' | 'vendor' | 'lead';

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    status: ContactStatus;
    type: ContactType;
    lastActivity: string; // ISO Date
    avatar?: string;
}
