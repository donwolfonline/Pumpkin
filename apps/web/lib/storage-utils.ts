import { api } from './api';
import type { OrganizationBranding } from './types/organization-settings';
import { DEFAULT_BRANDING } from './types/organization-settings';
export { DEFAULT_BRANDING };
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

    // If we already have data for this user, DO NOT migrate from guest/legacy.
    // This prevents "Michael Duo" from appearing if the user has already started their session.
    if (data) {
        try {
            return JSON.parse(data) as T;
        } catch (e) {
            console.error(`Failed to parse user data for key: ${userKey}`, e);
            return null;
        }
    }

    // Migration 1: Check for Guest Data (guest_pumpkin_xxx)
    const guestKey = `guest_${key}`;
    const guestData = localStorage.getItem(guestKey);

    if (guestData) {
        try {
            const parsed = JSON.parse(guestData) as T;

            // SECURITY/CLEANUP: Filter out known mock data ("Michael Duo" / "INV-6413")
            if (key === STORAGE_KEYS.INVOICES && Array.isArray(parsed)) {
                const cleaned = (parsed as Invoice[]).filter(inv =>
                    inv.clientName !== 'Michael Duo' && inv.invoiceNumber !== 'INV-6413'
                );

                if (cleaned.length !== parsed.length) {
                    console.log(`Filtered ${parsed.length - cleaned.length} mock invoice(s) from migration`);
                    if (cleaned.length === 0) return null;
                    // Migrate cleaned data to user-scoped storage
                    setUserData(key, cleaned as unknown as T);
                    return cleaned as unknown as T;
                }
            }

            // Migrate guest data to user-scoped storage
            setUserData(key, parsed);

            // CLEANUP: Remove guest data to prevent duplicates and stale lookups
            localStorage.removeItem(guestKey);
            console.log(`Successfully migrated and cleaned up guest data for ${key}`);

            return parsed;
        } catch {
            // Fall through
        }
    }

    // Migration 2: Check for legacy non-scoped data (pumpkin_xxx)
    const legacyData = localStorage.getItem(key);
    if (legacyData) {
        try {
            const parsed = JSON.parse(legacyData) as T;
            // Migrate to user-scoped storage automatically
            setUserData(key, parsed);

            // CLEANUP: Remove legacy data
            localStorage.removeItem(key);
            console.log(`Successfully migrated and cleaned up legacy data for ${key}`);

            return parsed;
        } catch {
            return null;
        }
    }
    return null;
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
 * DANGEROUS: Clears ENTIRE localStorage
 * Used specifically to wipe all legacy/guest data if the user wants a clean slate.
 */
export function dangerouslyClearAllLocalStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
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

    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && /_pumpkin_contracts/.test(k)) keys.push(k);
    }

    // Prioritize user-scoped keys over guest keys
    keys.sort((a, b) => {
        if (a.startsWith('guest_') && !b.startsWith('guest_')) return 1;
        if (!a.startsWith('guest_') && b.startsWith('guest_')) return -1;
        return 0;
    });

    for (const key of keys) {
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

    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && /_pumpkin_proposals/.test(k)) keys.push(k);
    }

    // Prioritize user-scoped keys over guest keys
    keys.sort((a, b) => {
        if (a.startsWith('guest_') && !b.startsWith('guest_')) return 1;
        if (!a.startsWith('guest_') && b.startsWith('guest_')) return -1;
        return 0;
    });

    for (const key of keys) {
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

    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && /_pumpkin_invoices/.test(k)) keys.push(k);
    }

    // Prioritize user-scoped keys over guest keys
    keys.sort((a, b) => {
        if (a.startsWith('guest_') && !b.startsWith('guest_')) return 1;
        if (!a.startsWith('guest_') && b.startsWith('guest_')) return -1;
        return 0;
    });

    for (const key of keys) {
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

/**
 * Scans ALL localStorage keys to find invoices for a specific client email.
 * This bridges the gap between Provider (local storage) and Client (portal).
 */
export function getInvoicesForClient(clientEmail: string): Invoice[] {
    if (typeof window === 'undefined' || !clientEmail) return [];

    const results: Invoice[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && /_pumpkin_invoices/.test(key)) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const invoices = JSON.parse(data) as Invoice[];
                    invoices.forEach(inv => {
                        if (inv.clientEmail?.toLowerCase() === clientEmail.toLowerCase() && !seenIds.has(inv.id)) {
                            results.push(inv);
                            seenIds.add(inv.id);
                        }
                    });
                } catch {
                    continue;
                }
            }
        }
    }
    return results;
}

/**
 * Scans ALL localStorage keys to find contracts for a specific client email.
 */
export function getContractsForClient(clientEmail: string): Contract[] {
    if (typeof window === 'undefined' || !clientEmail) return [];

    const results: Contract[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && /_pumpkin_contracts/.test(key)) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const contracts = JSON.parse(data) as Contract[];
                    contracts.forEach(c => {
                        // Using specific type cast for legacy/orphaned shape checking instead of 'any'
                        const clientEmailField = (c as { clientEmail?: string }).clientEmail;
                        if (clientEmailField?.toLowerCase() === clientEmail.toLowerCase() && !seenIds.has(c.id)) {
                            results.push(c);
                            seenIds.add(c.id);
                        }
                    });
                } catch {
                    continue;
                }
            }
        }
    }
    return results;
}

/**
 * Scans ALL localStorage keys to find projects for a specific client email.
 */
export function getProjectsForClient(clientEmail: string): Project[] {
    if (typeof window === 'undefined' || !clientEmail) return [];

    const results: Project[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && /_pumpkin_projects/.test(key)) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const projects = JSON.parse(data) as Project[];
                    projects.forEach(p => {
                        if (p.clientEmail?.toLowerCase() === clientEmail.toLowerCase() && !seenIds.has(p.id)) {
                            results.push(p);
                            seenIds.add(p.id);
                        }
                    });
                } catch {
                    continue;
                }
            }
        }
    }
    return results;
}

/**
 * Scans ALL localStorage keys to find proposals for a specific client email.
 */
export function getProposalsForClient(clientEmail: string): Proposal[] {
    if (typeof window === 'undefined' || !clientEmail) return [];

    const results: Proposal[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && /_pumpkin_proposals/.test(key)) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const proposals = JSON.parse(data) as Proposal[];
                    proposals.forEach(p => {
                        if (p.clientEmail?.toLowerCase() === clientEmail.toLowerCase() && !seenIds.has(p.id)) {
                            results.push(p);
                            seenIds.add(p.id);
                        }
                    });
                } catch {
                    continue;
                }
            }
        }
    }
    return results;
}

/**
 * Scans for "orphan" data in LocalStorage (data not belonging to the current user).
 * This helps recover data if the user ID changed or if they were using a guest session.
 * @param filter - Optional filters to ensure we only find data relevant to THIS user.
 */
export function scanForOrphanData(filter?: { email?: string; companyName?: string }): { found: boolean; count: number; keys: string[] } {
    if (typeof window === 'undefined') return { found: false, count: 0, keys: [] };

    const user = api.getUser();
    if (!user) return { found: false, count: 0, keys: [] };

    const currentPrefix = `${user.id}_`;
    const orphanKeys: string[] = [];
    let itemCount = 0;

    const matchesFilter = (raw: string | null): boolean => {
        if (!raw) return false;
        if (!filter) return true; // No filter, allow all (legacy behavior)

        const rawLower = raw.toLowerCase();
        const emailMatch = filter.email ? rawLower.includes(filter.email.toLowerCase()) : false;
        const companyMatch = filter.companyName ? rawLower.includes(filter.companyName.toLowerCase()) : false;

        return emailMatch || companyMatch;
    };

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        const rawData = localStorage.getItem(key);
        if (!rawData) continue;

        // Look for any pumpkin data
        if (key.includes('_pumpkin_')) {
            // If it DOESN'T start with current user prefix, check if it's orphan AND matches filter
            if (!key.startsWith(currentPrefix) && matchesFilter(rawData)) {
                orphanKeys.push(key);
                try {
                    const data = JSON.parse(rawData);
                    if (Array.isArray(data)) itemCount += data.length;
                    else if (data) itemCount += 1;
                } catch { }
            }
        }
        // Also check allow-listed legacy keys without prefix if they exist
        else if (key.startsWith('pumpkin_') && !key.includes('settings')) {
            if (matchesFilter(rawData)) {
                orphanKeys.push(key);
                try {
                    const data = JSON.parse(rawData);
                    if (Array.isArray(data)) itemCount += data.length;
                    else if (data) itemCount += 1;
                } catch { }
            }
        }
    }

    return { found: orphanKeys.length > 0, count: itemCount, keys: orphanKeys };
}

/**
 * Performs a deep content scan of LocalStorage.
 * Searches for specific strings (like company names) or specific data shapes
 * ONLY if they match the user's specific context.
 */
export function deepScanForData(query: { email: string; companyName: string }): { found: boolean; matches: { key: string; type: string; summary: string }[] } {
    if (typeof window === 'undefined') return { found: false, matches: [] };

    const matches: { key: string; type: string; summary: string }[] = [];
    const emailLower = query.email.toLowerCase();
    const companyLower = query.companyName.toLowerCase();

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        const raw = localStorage.getItem(key);
        if (!raw || !raw.startsWith('[') && !raw.startsWith('{')) continue; // Fast skip non-JSON

        const rawLower = raw.toLowerCase();

        // Strict requirement: Must contain the email or company name to even be considered
        const isContextMatch = rawLower.includes(emailLower) || (companyLower && rawLower.includes(companyLower));
        if (!isContextMatch) continue;

        try {
            const data = JSON.parse(raw);

            // Check for Organization Branding
            if (data.companyName && data.brandColors && data.address) {
                matches.push({ key, type: 'Organization', summary: data.companyName });
            }
            // Check for Invoices
            else if (Array.isArray(data) && data.length > 0 && data[0].invoiceNumber && data[0].total) {
                matches.push({ key, type: 'Invoices', summary: `${data.length} invoices` });
            }
            // Check for Team
            else if (Array.isArray(data) && data.length > 0 && data[0].role && (data[0].role === 'Admin' || data[0].role === 'Member')) {
                matches.push({ key, type: 'Team', summary: `${data.length} members` });
            }
            // Generic match if context found but shape not recognized
            else {
                matches.push({ key, type: 'Custom Data', summary: 'Storage match found' });
            }
        } catch {
            // Not JSON
        }
    }

    return { found: matches.length > 0, matches };
}

/**
 * Recovers data from a specific arbitrary key into the current user's storage.
 */
export function recoverSpecificKey(sourceKey: string, targetType: 'organization' | 'invoices' | 'team' | 'auto', context?: { email: string; companyName: string }): boolean {
    if (typeof window === 'undefined') return false;
    const raw = localStorage.getItem(sourceKey);
    if (!raw) return false;

    // Safety check: Don't recover if it doesn't match the current user's context
    if (context) {
        const rawLower = raw.toLowerCase();
        if (!rawLower.includes(context.email.toLowerCase()) &&
            (!context.companyName || !rawLower.includes(context.companyName.toLowerCase()))) {
            console.warn('Recovery blocked: Context mismatch');
            return false;
        }
    }

    try {
        const data = JSON.parse(raw);

        if (targetType === 'organization' || (targetType === 'auto' && data.companyName)) {
            setOrganizationBranding(data);
            return true;
        }

        if (targetType === 'invoices' || (targetType === 'auto' && Array.isArray(data) && data[0]?.invoiceNumber)) {
            setInvoices(data); // This overwrites current invoices, maybe merge is safer?
            // For recovery of lost data, overwrite might be expected if current is empty.
            // But let's verify. Ideally we merge.
            // Re-using the merge logic from recoverOrphanData would be better but simple set is okay for "I see nothing".
            return true;
        }

        if (targetType === 'team' || (targetType === 'auto' && Array.isArray(data) && data[0]?.role)) {
            setUserData('pumpkin_team_settings', data);
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

/**
 * Recovers orphan data by merging it into the current user's storage.
 */
export function recoverOrphanData(filter?: { email?: string; companyName?: string }): { success: boolean; recoveredCount: number } {
    if (typeof window === 'undefined') return { success: false, recoveredCount: 0 };

    const scan = scanForOrphanData(filter);
    if (!scan.found) return { success: true, recoveredCount: 0 };

    const user = api.getUser();
    if (!user) return { success: false, recoveredCount: 0 };

    let recoveredTotal = 0;

    // Helper to merge arrays unique by ID
    const mergeData = (currentKey: string, orphanKey: string) => {
        const currentData = getUserData<Invoice[] | Contract[] | Proposal[] | Contact[] | Project[]>(currentKey) || [];
        const orphanRaw = localStorage.getItem(orphanKey);
        if (!orphanRaw) return;

        try {
            const orphanData = JSON.parse(orphanRaw);
            if (!Array.isArray(orphanData)) return;

            const existingIds = new Set(currentData.map(item => item.id));
            let added = 0;

            orphanData.forEach(item => {
                // If item has an ID and we don't have it, add it
                if (item.id && !existingIds.has(item.id)) {
                    currentData.push(item);
                    existingIds.add(item.id);
                    added++;
                }
            });

            if (added > 0) {
                setUserData(currentKey, currentData);
                recoveredTotal += added;
            }
        } catch (e) {
            console.error(`Failed to recover data from ${orphanKey}`, e);
        }
    };

    scan.keys.forEach(orphanKey => {
        // Determine the target key type (invoices, clients, etc.)
        if (orphanKey.includes('pumpkin_invoices')) mergeData(STORAGE_KEYS.INVOICES, orphanKey);
        else if (orphanKey.includes('pumpkin_contracts')) mergeData(STORAGE_KEYS.CONTRACTS, orphanKey);
        else if (orphanKey.includes('pumpkin_proposals')) mergeData(STORAGE_KEYS.PROPOSALS, orphanKey);
        else if (orphanKey.includes('pumpkin_contacts')) mergeData(STORAGE_KEYS.CONTACTS, orphanKey);
        else if (orphanKey.includes('pumpkin_projects')) mergeData(STORAGE_KEYS.PROJECTS, orphanKey);
    });

    return { success: true, recoveredCount: recoveredTotal };
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

// Super Admin Helpers
// Since we're using localStorage, we need to scan all keys to aggregate data for the admin dashboard.

export interface AdminUserSummary {
    id: string;
    name: string;
    email: string;
    role: string;
    joinedAt: Date;
    subscriptionTier: string;
    revenue: number;
}

export function getAllUsersForAdmin(): AdminUserSummary[] {
    if (typeof window === 'undefined') return [];

    const users: AdminUserSummary[] = [];
    const seenUserIds = new Set<string>();

    // We can infer users by looking for organization keys (user_id_pumpkin_organization)
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('_pumpkin_organization') && !key.startsWith('guest_')) {
            const userId = key.split('_')[0];
            if (seenUserIds.has(userId)) continue;
            seenUserIds.add(userId);

            // Try to fetch org data
            let orgData: (OrganizationBranding & { subscriptionTier?: string }) | null = null;
            try {
                orgData = JSON.parse(localStorage.getItem(key) || '{}');
            } catch { }

            // Try to infer email/name from profile logic or mock it based on ID if we stored profile separately
            // In our mock auth, we don't store a separate "users" table in localStorage, 
            // but we can derive some info or use placeholder if missing.

            // Calculate platform revenue based on subscription tier (Monthly Recurring Revenue)
            let monthlyRevenue = 0;
            const tier = orgData?.subscriptionTier || 'free';

            if (tier === 'starter') monthlyRevenue = 12;      // Sprout Plan
            else if (tier === 'professional') monthlyRevenue = 29; // Big Pumpkin Plan
            else if (tier === 'enterprise') monthlyRevenue = 299; // Custom Plan (Estimated)

            users.push({
                id: userId,
                name: orgData?.companyName || `User ${userId.substring(0, 4)}`,
                email: orgData?.email || `user_${userId}@example.com`,
                role: 'Proprietor', // Default role for main user
                joinedAt: new Date(), // Mock date since we don't store user creation in LS
                subscriptionTier: tier === 'free' ? 'Seedling (Free)' :
                    tier === 'starter' ? 'Sprout ($12/mo)' :
                        tier === 'professional' ? 'Big Pumpkin ($29/mo)' : 'Enterprise',
                revenue: monthlyRevenue
            });
        }
    }

    return users;
}


// Website Builder Types & Helpers
export interface SitePage {
    id: string;
    slug: string; // e.g., 'about', 'contact'
    title: string;
    content: string; // Plain text or simple HTML for now
    isHome?: boolean;
}

export interface SiteNavigationLink {
    id: string;
    label: string;
    url: string; // #section, /path, or https://
    type: 'page' | 'external' | 'section';
}

export interface ServiceOffering {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[]; // URLs
    category: 'service' | 'product';
    customCategory?: string; // User defined category
    stock?: number;   // For products
    duration?: number; // For services (minutes)
}

export interface UserSite {
    id: string;
    userId: string;
    subdomain: string;
    title: string;
    description: string;
    themeColor: string;
    offerings: ServiceOffering[];
    pages: SitePage[];
    headerLinks: SiteNavigationLink[];
    categories: string[]; // User defined categories
    logo?: string; // Base64 or URL
    footerContent?: string;
    socialLinks?: { platform: string; url: string }[];
    published: boolean;
    updatedAt: string;
}

const STORAGE_KEY_SITES = 'pumpkin_sites';

export const getUserSite = (): UserSite | null => {
    // 1. Try new plural key
    const site = getUserData<UserSite>(STORAGE_KEY_SITES);
    if (site) return site;

    // 2. Fallback: Try legacy singular key (migration)
    const legacySite = getUserData<UserSite>('pumpkin_site');
    if (legacySite) {
        // Migrate to new key immediately
        saveUserSite(legacySite);
        // Clean up old key (optional, but good for hygiene)
        // removeUserData('pumpkin_site'); 
        return legacySite;
    }

    return null;
};

export const saveUserSite = (site: UserSite): void => {
    setUserData(STORAGE_KEY_SITES, site);
};

/**
 * Public Site Helpers (Global Scan)
 * Since sites are public, we need to scan all localStorage keys to find the one matching the subdomain.
 */
export const getPublicSiteBySubdomain = (subdomain: string): UserSite | null => {
    if (typeof window === 'undefined') return null;

    const targetSubdomain = subdomain.toLowerCase();

    // 1. Check current user first (optimization)
    const currentSite = getUserSite();
    if (currentSite && currentSite.subdomain && currentSite.subdomain.toLowerCase() === targetSubdomain && currentSite.published) {
        return currentSite;
    }

    // 2. Scan all storage for other users' sites to support multi-tenancy simulation
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // We look for any key that ends with 'pumpkin_sites' AND stores a single object (not array) that matches our shape
        // OR specifically matches our known key pattern `userId_pumpkin_sites`
        // Check for both legacy (pumpkin_site) and new (pumpkin_sites) keys
        if (key && (key.includes(STORAGE_KEY_SITES) || key.includes('pumpkin_site'))) {
            try {
                const data = localStorage.getItem(key);
                if (data) {
                    const site = JSON.parse(data) as UserSite;
                    // Check if it's the right shape and matches subdomain
                    if (site.subdomain && site.subdomain.toLowerCase() === targetSubdomain && site.published) {
                        return site;
                    }
                }
            } catch {
                continue;
            }
        }
    }
    return null;
};

/**
 * DEBUG HELPER: Returns all sites found in storage.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debugPublicSites = (): any[] => {
    if (typeof window === 'undefined') return [];
    const sites = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('pumpkin_sites') || key.includes('pumpkin_site'))) {
            try {
                const data = localStorage.getItem(key);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (data) sites.push({ key, data: JSON.parse(data) as any });
            } catch (e) { sites.push({ key, error: e }); }
        }
    }
    return sites;
};

