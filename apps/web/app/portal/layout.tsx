import { ReactNode } from 'react';

export default function PortalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background relative overflow-x-hidden">
            {/* Signature Atmospheric Effects */}
            <div className="fixed inset-0 moonlight pointer-events-none opacity-50" />
            <div className="fixed inset-0 bg-grid-pattern text-white/[0.02] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
