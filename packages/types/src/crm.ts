import type { Timestamps, Address } from './common';

export type ContactType = 'individual' | 'company';

export interface Contact extends Timestamps {
    id: string;
    organizationId: string;
    type: ContactType;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    address?: Address;
    tags: string[];
    customFields: Record<string, any>;
    ownerId?: string;
    createdBy: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'lost';

export interface Lead extends Timestamps {
    id: string;
    organizationId: string;
    contactId: string;
    title: string;
    description?: string;
    status: LeadStatus;
    source?: string;
    value?: number;
    probability?: number;
    expectedCloseDate?: Date;
    ownerId?: string;
    createdBy: string;
}

export type DealStage = 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal extends Timestamps {
    id: string;
    organizationId: string;
    contactId: string;
    leadId?: string;
    title: string;
    description?: string;
    stage: DealStage;
    value?: number;
    closeDate?: Date;
    ownerId?: string;
    createdBy: string;
}

export type ActivityType = 'note' | 'call' | 'meeting' | 'email';

export interface Activity extends Timestamps {
    id: string;
    organizationId: string;
    type: ActivityType;
    subject?: string;
    description?: string;
    contactId?: string;
    leadId?: string;
    dealId?: string;
    scheduledAt?: Date;
    completedAt?: Date;
    createdBy: string;
}
