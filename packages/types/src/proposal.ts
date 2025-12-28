import type { Timestamps } from './common';

export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';

export interface ProposalTemplate extends Timestamps {
    id: string;
    organizationId: string;
    name: string;
    content: any; // Block editor JSON
    variables: string[];
    isDefault: boolean;
    createdBy: string;
}

export interface Proposal extends Timestamps {
    id: string;
    organizationId: string;
    contactId?: string;
    dealId?: string;
    templateId?: string;
    title: string;
    content: any;
    status: ProposalStatus;
    totalAmount?: number;
    validUntil?: Date;
    sentAt?: Date;
    viewedAt?: Date;
    acceptedAt?: Date;
    signatureData?: any;
    createdBy: string;
}

export interface ProposalItem {
    id: string;
    proposalId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    total: number;
    sortOrder: number;
}
