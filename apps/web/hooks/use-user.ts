'use client';

import { useSyncExternalStore } from 'react';
import { api, type User } from '@/lib/api';

/**
 * Subscribe to both custom 'user-updated' events and standard 'storage' events.
 * This allows the hook to react to changes in the same tab and other tabs.
 */
function subscribe(onStoreChange: () => void) {
    if (typeof window === 'undefined') return () => { };

    window.addEventListener('user-updated', onStoreChange);
    window.addEventListener('storage', (event) => {
        if (event.key === 'user') {
            onStoreChange();
        }
    });

    return () => {
        window.removeEventListener('user-updated', onStoreChange);
        window.removeEventListener('storage', onStoreChange);
    };
}

function getSnapshot() {
    return api.getUser();
}

function getServerSnapshot() {
    return null;
}

export function useUser(): User | null {
    // useSyncExternalStore is the modern way to sync with external stores
    // such as localStorage, avoiding cascading renders and hydration issues.
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
