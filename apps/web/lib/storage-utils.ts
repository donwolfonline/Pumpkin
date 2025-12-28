import { api } from './api';

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

    if (!data) return null;

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
