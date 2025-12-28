'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, CreditCard, Menu } from 'lucide-react';

export function MobileNav() {
    const pathname = usePathname();

    const items = [
        { label: 'Home', icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard' },
        { label: 'CRM', icon: <Users className="h-5 w-5" />, href: '/crm' },
        { label: 'Bills', icon: <CreditCard className="h-5 w-5" />, href: '/payments' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#051c1c]/80 backdrop-blur-xl border-t border-white/5 pb-safe">
            <div className="flex items-center justify-around h-16 px-4">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all",
                                isActive ? "text-primary scale-110" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-lg transition-all",
                                isActive && "shadow-[0_0_15px_rgba(249,115,22,0.3)] bg-primary/10"
                            )}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                        </Link>
                    );
                })}

                <button
                    type="button"
                    className="flex flex-col items-center justify-center w-full h-full space-y-1 text-zinc-500 hover:text-white transition-all"
                    onClick={() => {
                        // Dispatch event to open mobile sidebar
                        window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
                    }}
                >
                    <div className="p-1">
                        <Menu className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">More</span>
                </button>
            </div>
        </div>
    );
}
