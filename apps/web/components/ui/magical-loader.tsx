"use client";

import { Skull } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function MagicalLoader({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col items-center gap-4 animate-[magical-appear_1s_ease-out_infinite_alternate]", className)}>
            <div className="relative">
                <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full animate-pulse" />
                <Skull className="h-16 w-16 text-primary relative z-10 animate-[bounce_3s_infinite]" />
            </div>
            <p className="text-primary font-heading uppercase tracking-[0.3em] text-xs font-bold animate-pulse">
                Summoning...
            </p>
        </div>
    );
}

export function NavigationLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isSummoning, setIsSummoning] = useState(false);

    useEffect(() => {
        // Trigger loading on path change
        setIsSummoning(true);
        const timer = setTimeout(() => {
            setIsSummoning(false);
        }, 1200); // 1.2s mystical delay

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    if (!isSummoning) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#051c1c] flex items-center justify-center animate-[fade-in_0.3s_ease-out]">
            <MagicalLoader />
        </div>
    );
}
