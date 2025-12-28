'use client';

import { useSyncExternalStore } from 'react';
import { api, type User } from '@/lib/api';

// Cache the last snapshot to ensure stable references
let cachedSnapshot: User | null = null;
let cachedSnapshotString: string | null = null;

/**
 * Subscribe to both custom 'user-updated' events and standard 'storage' events.
 * This allows the hook to react to changes in the same tab and other tabs.
 */
function subscribe(onStoreChange: () => void) {
    if (typeof window === 'undefined') return () => { };

    const handleUserUpdate = () => {
        // Clear cache when user updates
        cachedSnapshot = null;
        cachedSnapshotString = null;
        onStoreChange();
    };

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'user') {
            // Clear cache when storage changes
            cachedSnapshot = null;
            cachedSnapshotString = null;
            onStoreChange();
        }
    };

    window.addEventListener('user-updated', handleUserUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('user-updated', handleUserUpdate);
        window.removeEventListener('storage', handleStorageChange);
    };
}

function getSnapshot(): User | null {
    const user = api.getUser();
    const userString = user ? JSON.stringify(user) : null;

    // Only update cached snapshot if the data actually changed
    if (userString !== cachedSnapshotString) {
        cachedSnapshot = user;
        cachedSnapshotString = userString;
    }

    return cachedSnapshot;
}

function getServerSnapshot() {
    return null;
}

export function useUser(): User | null {
    // useSyncExternalStore is the modern way to sync with external stores
    // such as localStorage, avoiding cascading renders and hydration issues.
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
