export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'pending_signatures' | 'signed' | 'accepted' | 'declined';

export interface ProposalSignature {
    party: 'provider' | 'client';
    name: string;
    title?: string;
    signedAt?: string; // ISO Date
    signatureData?: string; // Base64 signature image or typed name
}

export interface Proposal {
    id: string;
    organizationId: string;
    clientId?: string;
    clientName?: string;
    title: string;
    content: unknown;
    status: ProposalStatus;
    totalAmount?: number;
    validUntil?: string;
    createdAt?: string;
    sentAt?: string;
    viewedAt?: string;
    acceptedAt?: string;
    signatures?: ProposalSignature[]; // Track both provider and client signatures
    createdBy?: string;
    updatedAt?: string;
}
