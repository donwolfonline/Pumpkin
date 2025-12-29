const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
import { Appointment } from './types/appointment';
import { Contact } from './types/crm';
import { Invoice } from './types/invoice';

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
    avatar?: string;
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

        // Initialize registration date for trial tracking
        const { initializeRegistrationDate } = await import('./subscription-utils');
        initializeRegistrationDate();

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

        const { getUserData } = await import('./storage-utils');

        // Calculate revenue from local invoices if available
        let totalRevenue = 0; // Start with 0 for new users
        let totalLeads = 0;
        let activeAppointments = 0;
        let harvestEfficiency = 0;
        let revenueChange = 0;

        if (typeof window !== 'undefined') {
            // Invoices - using user-scoped key
            const invoices = getUserData<Invoice[]>('pumpkin_invoices');
            if (invoices && invoices.length > 0) {
                try {
                    const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
                    const revenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
                    totalRevenue = revenue;
                } catch {
                    console.error('Failed to calculate revenue from local storage');
                }
            }

            // Harvest Efficiency = (Paid / Total Invoiced) * 100
            if (invoices && invoices.length > 0) {
                try {
                    const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
                    const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
                    if (totalInvoiced > 0) {
                        harvestEfficiency = Math.round((totalRevenue / totalInvoiced) * 100);
                    }

                    // Calculate Revenue Change (Current Month vs Last Month)
                    const now = new Date();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();

                    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    const lastMonth = lastMonthDate.getMonth();
                    const lastMonthYear = lastMonthDate.getFullYear();

                    const currentMonthRevenue = paidInvoices
                        .filter(inv => {
                            if (!inv.issueDate) return false;
                            const d = new Date(inv.issueDate);
                            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                        })
                        .reduce((sum, inv) => sum + (inv.total || 0), 0);

                    const lastMonthRevenue = paidInvoices
                        .filter(inv => {
                            if (!inv.issueDate) return false;
                            const d = new Date(inv.issueDate);
                            return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
                        })
                        .reduce((sum, inv) => sum + (inv.total || 0), 0);

                    if (lastMonthRevenue > 0) {
                        revenueChange = Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);
                    } else if (currentMonthRevenue > 0) {
                        revenueChange = 100; // 100% growth if started from 0
                    }
                } catch {
                    console.error('Failed to calculate harvest efficiency or revenue change');
                }
            }

            // Leads (Contacts) - using user-scoped key
            const contacts = getUserData<Contact[]>('pumpkin_contacts');
            if (contacts) {
                try {
                    // Assume all contacts are leads/inquiries for now, or filter by specific type if you had one
                    totalLeads = contacts.length;
                } catch {
                    console.error('Failed to calculate leads from local storage');
                }
            }

            // Appointments (Scheduling) - using user-scoped key
            const appointments = getUserData<Appointment[]>('pumpkin_appointments');
            if (appointments) {
                try {
                    // Count future appointments (assuming appointments are for today as they only have time)
                    const now = new Date();
                    activeAppointments = appointments.filter((apt) => {
                        if (!apt.time) return false;
                        const [hours, minutes] = apt.time.split(':').map(Number);
                        const aptDate = new Date();
                        aptDate.setHours(hours, minutes, 0, 0);
                        return aptDate >= now;
                    }).length;
                } catch {
                    console.error('Failed to calculate appointments from local storage');
                }
            }
        }

        // New Metrics: Signed Contracts & Active Projects
        const { getContracts, getProjects } = await import('./storage-utils');
        let totalSignedContracts = 0;
        let activeProjects = 0;

        try {
            const contracts = getContracts();
            totalSignedContracts = contracts.filter(c => c.status === 'signed').length;
        } catch (e) { console.error('Error fetching contracts stats', e); }

        try {
            const projects = getProjects();
            activeProjects = projects.filter(p => p.status === 'active').length;
        } catch (e) { console.error('Error fetching projects stats', e); }


        return Promise.resolve({
            totalLeads,
            activeAppointments,
            totalRevenue,
            harvestEfficiency,
            revenueChange,
            totalSignedContracts,
            activeProjects,
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
