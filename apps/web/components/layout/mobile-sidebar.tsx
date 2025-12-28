'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => setIsOpen((prev) => !prev);
        window.addEventListener('toggle-mobile-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-mobile-sidebar', handleToggle);
    }, []);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Content */}
            <div
                className={cn(
                    "fixed top-0 left-0 z-[101] h-screen w-72 bg-[#051c1c] lg:hidden transition-all duration-500 ease-in-out border-r border-white/5 shadow-2xl overflow-hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="absolute top-4 right-4 z-10">
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl">
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <Sidebar className="h-full" />
            </div>
        </>
    );
}
