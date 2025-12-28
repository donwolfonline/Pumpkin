import type { Timestamps } from './common';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice extends Timestamps {
    id: string;
    organizationId: string;
    contactId?: string;
    proposalId?: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    issueDate: Date;
    dueDate: Date;
    paidAt?: Date;
    stripeInvoiceId?: string;
    notes?: string;
    createdBy: string;
}

export interface InvoiceItem {
    id: string;
    invoiceId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    total: number;
    sortOrder: number;
}

export type PaymentStatus = 'succeeded' | 'pending' | 'failed';

export interface Payment extends Timestamps {
    id: string;
    organizationId: string;
    invoiceId?: string;
    contactId?: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
    stripePaymentId?: string;
    status: PaymentStatus;
    paidAt?: Date;
}
