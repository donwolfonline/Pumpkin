const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organizationId: string;
    role: string;
}

class ApiClient {
    private baseURL: string;
    private accessToken: string | null = null;

    constructor() {
        this.baseURL = API_URL;
        if (typeof window !== 'undefined') {
            this.accessToken = localStorage.getItem('accessToken');
        }
    }

    setTokens(tokens: AuthTokens) {
        this.accessToken = tokens.accessToken;
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
        }
    }

    clearTokens() {
        this.accessToken = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        // Sync token from localStorage if missing in memory (e.g. after refresh or tab switch)
        if (!this.accessToken && typeof window !== 'undefined') {
            this.accessToken = localStorage.getItem('accessToken');
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (this.accessToken && this.accessToken !== 'null' && this.accessToken !== 'undefined') {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401 && !endpoint.includes('/auth/login')) {
            // Token expired or invalid, clear everything and redirect to login
            this.clearTokens();
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Auth endpoints
    async register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        organizationName: string;
    }) {
        const response = await this.request<AuthTokens & { user: User }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        this.setTokens(response);
        this.setUser(response.user);
        return response;
    }

    async login(email: string, password: string) {
        const response = await this.request<AuthTokens & { user: User }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setTokens(response);
        this.setUser(response.user);
        return response;
    }

    setUser(user: User) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new CustomEvent('user-updated'));
        }
    }

    getUser(): User | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    logout() {
        this.clearTokens();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            window.dispatchEvent(new CustomEvent('user-updated'));
        }
    }

    // Analytics
    async getAnalyticsSummary() {
        // Return mock data for now to prevent 401 errors from backend
        // In a real app, this would calculate from local data or fetch from API

        // Calculate revenue from local invoices if available
        let totalRevenue = 12500; // default mock
        let totalLeads = 0;
        let activeAppointments = 0;

        if (typeof window !== 'undefined') {
            // Invoices
            const savedInvoices = localStorage.getItem('pumpkin_invoices');
            if (savedInvoices) {
                try {
                    const invoices = JSON.parse(savedInvoices);
                    const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid');
                    const revenue = paidInvoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
                    if (revenue > 0) totalRevenue = revenue;
                } catch (e) {
                    console.error('Failed to calculate revenue from local storage');
                }
            }

            // Leads (Contacts)
            const savedContacts = localStorage.getItem('pumpkin_contacts');
            if (savedContacts) {
                try {
                    const contacts = JSON.parse(savedContacts);
                    // Assume all contacts are leads/inquiries for now, or filter by specific type if you had one
                    totalLeads = contacts.length;
                } catch (e) {
                    console.error('Failed to calculate leads from local storage');
                }
            }

            // Appointments (Scheduling)
            const savedAppointments = localStorage.getItem('pumpkin_appointments');
            if (savedAppointments) {
                try {
                    const appointments = JSON.parse(savedAppointments);
                    // Count future appointments
                    const now = new Date();
                    activeAppointments = appointments.filter((apt: any) => new Date(apt.date) >= now).length;
                } catch (e) {
                    console.error('Failed to calculate appointments from local storage');
                }
            }
        }

        return Promise.resolve({
            totalLeads,
            activeAppointments,
            totalRevenue,
            currency: 'USD'
        });
    }

    // CRM
    async getContacts() {
        return this.request<import('./types/crm').Contact[]>('/crm/contacts');
    }

    // Add other API methods as needed...
}

export const api = new ApiClient();
