export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'canceled';

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    status: InvoiceStatus;
    issueDate: string; // ISO Date
    dueDate: string; // ISO Date
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    notes?: string;
}
