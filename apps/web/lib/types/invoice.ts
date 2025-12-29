export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'canceled';

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    taxRate?: number; // Tax percentage for this item
}

export interface ClientInfo {
    name: string;
    email: string;
    company?: string;
    address?: string;
    phone?: string;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientCompany?: string;
    clientAddress?: string;
    clientPhone?: string;
    status: InvoiceStatus;
    issueDate: string; // ISO Date
    dueDate: string; // ISO Date
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number; // Tax percentage (e.g., 10 for 10%)
    tax: number;
    total: number;
    paymentMethod?: string; // e.g., "Bank Transfer - Ebank", "PayPal"
    paymentDetails?: string; // Account number or additional payment info
    notes?: string;
    terms?: string; // Custom terms for this invoice
    updatedAt?: string; // ISO Date
    history?: InvoiceHistoryEvent[];
}

export interface InvoiceHistoryEvent {
    id: string;
    action: 'created' | 'sent' | 'viewed' | 'paid' | 'updated';
    timestamp: string;
    details?: string;
    actor?: string; // 'System', 'User', 'Client'
}
