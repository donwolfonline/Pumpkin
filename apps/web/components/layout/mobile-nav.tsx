'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, CreditCard, Menu, Calendar, FileText, BarChart3, GitBranch, Settings, LogOut } from 'lucide-react';

export function MobileNav() {
    const pathname = usePathname();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const items = [
        { label: 'Home', icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard' },
        { label: 'CRM', icon: <Users className="h-5 w-5" />, href: '/crm' },
        { label: 'Bills', icon: <CreditCard className="h-5 w-5" />, href: '/payments' },
    ];

    const moreItems = [
        { label: 'Projects', icon: <GitBranch className="h-5 w-5" />, href: '/projects' },
        { label: 'Scheduling', icon: <Calendar className="h-5 w-5" />, href: '/scheduling' },
        { label: 'Documents', icon: <FileText className="h-5 w-5" />, href: '/documents' },
        { label: 'Analytics', icon: <BarChart3 className="h-5 w-5" />, href: '/analytics' },
        { label: 'Profile', icon: <Users className="h-5 w-5" />, href: '/settings/profile' },
        { label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
        { label: 'Logout', icon: <LogOut className="h-5 w-5" />, href: '/logout' },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    isMoreOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMoreOpen(false)}
            />

            {/* More Menu (Circular/Creative) */}
            <div
                className={cn(
                    "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
                    isMoreOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-90 pointer-events-none"
                )}
            >
                <div className="grid grid-cols-3 gap-6">
                    {moreItems.map((item, index) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex flex-col items-center gap-2 group"
                            style={{ transitionDelay: `${index * 50}ms` }}
                            onClick={() => setIsMoreOpen(false)}
                        >
                            <div className="h-14 w-14 rounded-full bg-[#0c2a27] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:border-primary/50 group-hover:bg-[#0c2a27]/80 transition-all shadow-lg hover:shadow-primary/20 hover:scale-110">
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Floating Navigation Pill */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
                <div className="bg-[#051c1c]/90 backdrop-blur-2xl border border-white/10 rounded-full py-3 px-6 shadow-2xl shadow-black/50">
                    <div className="flex items-center justify-between">
                        {items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center justify-center w-12 space-y-1 transition-all",
                                        isActive ? "text-primary" : "text-zinc-500 hover:text-white"
                                    )}
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-full transition-all duration-300",
                                        isActive && "bg-primary/10 text-primary transform -translate-y-1"
                                    )}>
                                        {item.icon}
                                    </div>
                                    {/* Optional: Hide text on non-active or keep perfectly minimal? Keeping text for clarity but smaller */}
                                    {/* <span className={cn("text-[9px] font-bold uppercase tracking-widest transition-all", isActive ? "opacity-100" : "opacity-0 h-0 w-0 overflow-hidden")}>{item.label}</span> */}
                                </Link>
                            );
                        })}

                        <button
                            type="button"
                            className={cn(
                                "flex flex-col items-center justify-center w-12 space-y-1 transition-all text-zinc-500 hover:text-white",
                                isMoreOpen && "text-primary"
                            )}
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                        >
                            <div className={cn(
                                "p-1.5 rounded-full transition-all duration-300",
                                isMoreOpen ? "bg-primary/10 rotate-90" : ""
                            )}>
                                <Menu className="h-5 w-5" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
