import { OrganizationBranding } from './organization-settings';

export type ContractStatus = 'draft' | 'pending' | 'signed' | 'active' | 'completed' | 'terminated' | 'expired';

export interface PaymentSchedule {
    id: string;
    description: string;
    amount: number;
    dueDate: string; // ISO Date
    status: 'pending' | 'paid';
}

export interface Signature {
    party: 'company' | 'client';
    name: string;
    title?: string;
    signedAt?: string; // ISO Date
    signatureData?: string; // Base64 signature image
}

export interface Deliverable {
    id: string;
    description: string;
    dueDate?: string; // ISO Date
    completed: boolean;
}

export interface Contract {
    id: string;
    contractNumber: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientCompany?: string;
    clientAddress?: string;
    title: string;
    description: string;
    startDate: string; // ISO Date
    endDate: string; // ISO Date
    status: ContractStatus;
    terms: string; // Full contract terms and conditions
    paymentSchedule: PaymentSchedule[];
    deliverables: Deliverable[];
    totalValue: number;
    signatures: Signature[];
    createdAt: string; // ISO Date
    updatedAt: string; // ISO Date
    notes?: string;
    brandingSnapshot?: OrganizationBranding;
}
