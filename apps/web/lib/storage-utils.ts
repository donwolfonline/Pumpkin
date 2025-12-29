import { api } from './api';
import type { OrganizationBranding } from './types/organization-settings';
import { DEFAULT_BRANDING } from './types/organization-settings';
import type { Invoice } from './types/invoice';
import type { Contract } from './types/contract';
import type { Proposal } from './types/proposal';
import type { Contact } from './types/crm';

/**
 * Generates a user-scoped localStorage key
 * @param key - The base key (e.g., 'pumpkin_invoices')
 * @returns User-scoped key (e.g., 'user123_pumpkin_invoices')
 */
export function getUserKey(key: string): string {
    const user = api.getUser();
    if (!user) {
        // If no user is logged in, use a guest prefix
        return `guest_${key}`;
    }
    return `${user.id}_${key}`;
}

/**
 * Gets user-scoped data from localStorage
 * @param key - The base key
 * @returns Parsed data or null
 */
export function getUserData<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    const userKey = getUserKey(key);
    const data = localStorage.getItem(userKey);

    if (!data) {
        // Migration check: If no user-scoped data, check for legacy non-scoped data
        const legacyData = localStorage.getItem(key);
        if (legacyData) {
            try {
                const parsed = JSON.parse(legacyData) as T;
                // Migrate to user-scoped storage automatically
                setUserData(key, parsed);
                return parsed;
            } catch {
                return null;
            }
        }
        return null;
    }

    try {
        return JSON.parse(data) as T;
    } catch (e) {
        console.error(`Failed to parse user data for key: ${userKey}`, e);
        return null;
    }
}

/**
 * Sets user-scoped data in localStorage
 * @param key - The base key
 * @param value - The value to store
 */
export function setUserData<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    const userKey = getUserKey(key);
    localStorage.setItem(userKey, JSON.stringify(value));
}

/**
 * Removes user-scoped data from localStorage
 * @param key - The base key
 */
export function removeUserData(key: string): void {
    if (typeof window === 'undefined') return;

    const userKey = getUserKey(key);
    localStorage.removeItem(userKey);
}

/**
 * Clears all data for the current user
 */
export function clearCurrentUserData(): void {
    if (typeof window === 'undefined') return;

    const user = api.getUser();
    if (!user) return;

    const userPrefix = `${user.id}_`;
    const keysToRemove: string[] = [];

    // Find all keys that belong to this user
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(userPrefix)) {
            keysToRemove.push(key);
        }
    }

    // Remove all user-scoped keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

/**
 * Clears all user-scoped data (for cleanup on logout)
 */
export function clearAllUserData(): void {
    if (typeof window === 'undefined') return;

    const keysToRemove: string[] = [];

    // Find all keys that look like user-scoped keys (contain underscore pattern)
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Match pattern: userId_pumpkin_xxx or guest_pumpkin_xxx
        if (key && /_pumpkin_/.test(key)) {
            keysToRemove.push(key);
        }
    }

    // Remove all user-scoped keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Specific storage keys
const STORAGE_KEYS = {
    ORGANIZATION: 'pumpkin_organization',
    INVOICES: 'pumpkin_invoices',
    PROPOSALS: 'pumpkin_proposals',
    CONTRACTS: 'pumpkin_contracts',
    CONTACTS: 'pumpkin_contacts',
    PROJECTS: 'pumpkin_projects',
} as const;

import type { Project } from './types/project';

// Project helpers
export const getProjects = (): Project[] => {
    return getUserData<Project[]>(STORAGE_KEYS.PROJECTS) || [];
};

export const setProjects = (projects: Project[]): void => {
    setUserData(STORAGE_KEYS.PROJECTS, projects);
};

// Organization/Branding helpers
export const getOrganizationBranding = (): OrganizationBranding => {
    const stored = getUserData<OrganizationBranding>(STORAGE_KEYS.ORGANIZATION);
    return stored || DEFAULT_BRANDING;
};

export const setOrganizationBranding = (branding: OrganizationBranding): void => {
    setUserData(STORAGE_KEYS.ORGANIZATION, branding);
};

// Invoice helpers
export const getInvoices = (): Invoice[] => {
    return getUserData<Invoice[]>(STORAGE_KEYS.INVOICES) || [];
};

export const setInvoices = (invoices: Invoice[]): void => {
    setUserData(STORAGE_KEYS.INVOICES, invoices);
};

// Proposal helpers
export const getProposals = (): Proposal[] => {
    const proposals = getUserData<Proposal[]>(STORAGE_KEYS.PROPOSALS) || [];

    // Auto-fix: if a proposal has clientId but no clientName, try to find it
    const needsFix = proposals.some(p => p.clientId && !p.clientName);
    if (needsFix) {
        const contacts = getContacts();
        const fixed = proposals.map(p => {
            if (!p.clientId || p.clientName) return p;
            const client = contacts.find(c => c.id === p.clientId);
            if (client) {
                return { ...p, clientName: client.name || `${client.firstName} ${client.lastName}`.trim() };
            }
            return p;
        });
        // We don't necessarily need to set it back to storage here to avoid side effects during a 'get',
        // but it will be correct in the returned array.
        return fixed;
    }

    return proposals;
};

export const setProposals = (proposals: Proposal[]): void => {
    setUserData(STORAGE_KEYS.PROPOSALS, proposals);
};

// Contract helpers
export const getContracts = (): Contract[] => {
    return getUserData<Contract[]>(STORAGE_KEYS.CONTRACTS) || [];
};

export const setContracts = (contracts: Contract[]): void => {
    setUserData(STORAGE_KEYS.CONTRACTS, contracts);
};

/**
 * Searches all localStorage for a specific contract ID.
 * This is used for guest access via public sharing links.
 */
export function getContractPublicly(id: string): { contract: Contract; storageKey: string } | null {
    if (typeof window === 'undefined') return null;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && /_pumpkin_contracts/.test(key)) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const contracts = JSON.parse(data) as (Contract & { id: string })[];
                    const found = contracts.find(c => c.id === id);
                    if (found) return { contract: found as Contract, storageKey: key };
                } catch {
                    continue;
                }
            }
        }
    }
    return null;
}

/**
 * Updates a contract in a specific localStorage key.
 */
export function updateContractByKey(key: string, updatedContract: Contract): void {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(key);
    if (data) {
        try {
            const contracts = JSON.parse(data) as (Contract & { id: string })[];
            const updated = contracts.map(c => c.id === updatedContract.id ? updatedContract : c);
            localStorage.setItem(key, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to update contract by key', e);
        }
    }
}

/**
 * Searches all localStorage for a specific proposal ID.
 * This is used for guest access via public sharing links.
 */
export function getProposalPublicly(id: string): { proposal: Proposal; storageKey: string } | null {
    if (typeof window === 'undefined') return null;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && /_pumpkin_proposals/.test(key)) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const proposals = JSON.parse(data) as (Proposal & { id: string })[];
                    const found = proposals.find(p => p.id === id);
                    if (found) return { proposal: found as Proposal, storageKey: key };
                } catch {
                    continue;
                }
            }
        }
    }
    return null;
}

/**
 * Updates a proposal in a specific localStorage key.
 */
export function updateProposalByKey(key: string, updatedProposal: Proposal): void {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(key);
    if (data) {
        try {
            const proposals = JSON.parse(data) as (Proposal & { id: string })[];
            const updated = proposals.map(p => p.id === updatedProposal.id ? updatedProposal : p);
            localStorage.setItem(key, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to update proposal by key', e);
        }
    }
}

/**
 * Searches all localStorage for a specific invoice ID.
 * This is used for guest access via public sharing links.
 */
export function getInvoicePublicly(id: string): { invoice: Invoice; storageKey: string } | null {
    if (typeof window === 'undefined') return null;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && /_pumpkin_invoices/.test(key)) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const invoices = JSON.parse(data) as (Invoice & { id: string })[];
                    const found = invoices.find(inv => inv.id === id);
                    if (found) return { invoice: found as Invoice, storageKey: key };
                } catch {
                    continue;
                }
            }
        }
    }
    return null;
}

/**
 * Updates an invoice in a specific localStorage key.
 */
export function updateInvoiceByKey(key: string, updatedInvoice: Invoice): void {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(key);
    if (data) {
        try {
            const invoices = JSON.parse(data) as (Invoice & { id: string })[];
            const updated = invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv);
            localStorage.setItem(key, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to update invoice by key', e);
        }
    }
}

// Contact helpers
export const getContacts = (): Contact[] => {
    const contacts = getUserData<Contact[]>(STORAGE_KEYS.CONTACTS) || [];

    // Migration: ensure all contacts have a 'name' field
    const needsMigration = contacts.some(c => !c.name);
    if (needsMigration) {
        const migrated = contacts.map(c => {
            if (c.name) return c;
            return {
                ...c,
                name: `${c.firstName} ${c.lastName}`.trim() || 'Unnamed Contact'
            };
        });
        setContacts(migrated);
        return migrated;
    }

    return contacts;
};

export const setContacts = (contacts: Contact[]): void => {
    setUserData(STORAGE_KEYS.CONTACTS, contacts);
};

/**
 * Ensures a contact exists in the database.
 * If a contact with the same email or name (first + last) exists, it returns the existing one.
 * Otherwise, it creates a new contact and saves it.
 */
export const ensureContactExists = (data: {
    fullName: string;
    email?: string;
    company?: string;
    type?: 'client' | 'lead';
}): Contact => {
    const contacts = getContacts();
    const nameParts = data.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Check if contact already exists by email (if provided) or name
    const existing = contacts.find(c =>
        (data.email && c.email.toLowerCase() === data.email.toLowerCase()) ||
        (c.firstName.toLowerCase() === firstName.toLowerCase() && c.lastName.toLowerCase() === lastName.toLowerCase())
    );

    if (existing) {
        return existing;
    }

    const newContact: Contact = {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        name: data.fullName,
        email: data.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        company: data.company || '',
        status: 'active',
        type: data.type || 'client',
        lastActivity: new Date().toISOString(),
    };

    setContacts([newContact, ...contacts]);
    return newContact;
};
