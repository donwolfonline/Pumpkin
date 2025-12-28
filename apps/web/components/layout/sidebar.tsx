'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/branding/logo';
import { useUser } from '@/hooks/use-user';
import { api } from '@/lib/api';
import { getSubscriptionStatus } from '@/lib/subscription-utils';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    CreditCard,
    BarChart3,
    Settings,
    GitBranch,
    LogOut,
    ArrowUpCircle
} from 'lucide-react';

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const user = useUser();
    const subscriptionStatus = getSubscriptionStatus();

    const menuItems = [
        { label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" />, href: '/dashboard' },
        { label: 'CRM', icon: <Users className="h-4 w-4" />, href: '/crm' },
        { label: 'Projects', icon: <GitBranch className="h-4 w-4" />, href: '/projects' },
        { label: 'Scheduling', icon: <Calendar className="h-4 w-4" />, href: '/scheduling' },
        { label: 'Documents', icon: <FileText className="h-4 w-4" />, href: '/documents' },
        { label: 'Payments', icon: <CreditCard className="h-4 w-4" />, href: '/payments' },
        { label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, href: '/analytics' },
    ];

    const initials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}` : 'P';
    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Pumpkin User';

    return (
        <div className={cn("flex flex-col h-screen bg-[#051c1c] border-r border-white/5", className)}>
            <div className="space-y-4 py-8 flex-1 overflow-y-auto scrollbar-hide">
                <div className="px-8 mb-8">
                    <Logo />
                </div>
                <div className="px-4 py-2">
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <Button
                                key={item.href}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all group",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(249,115,22,0.1)] border border-primary/20"
                                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <span className={cn(
                                        "mr-3 group-hover:scale-110 transition-transform",
                                        pathname === item.href ? "text-primary" : "text-zinc-500"
                                    )}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="py-2 px-4 mt-8">
                    <div className="mb-4 px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
                        Settings
                    </div>
                    <Button variant="ghost" className="w-full justify-start h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] text-zinc-500 hover:text-white hover:bg-white/5" asChild>
                        <Link href="/settings">
                            <Settings className="mr-3 h-4 w-4" />
                            Settings
                        </Link>
                    </Button>
                </div>

                {/* Upgrade Card for Free Users */}
                {subscriptionStatus.plan === 'free' && (
                    <div className="px-4 mt-4 pb-4">
                        <div className={`rounded-2xl bg-gradient-to-br from-[#0a2c28] to-[#051c1c] border p-4 shadow-2xl ${subscriptionStatus.daysRemaining <= 3 ? 'border-red-500/30' : 'border-white/5'
                            }`}>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                                {subscriptionStatus.status === 'expired' ? 'Trial Expired' : 'Seedling Plan'}
                            </p>
                            <p className={`text-xs font-medium mb-3 ${subscriptionStatus.daysRemaining <= 3 ? 'text-red-400' : 'text-white'
                                }`}>
                                {subscriptionStatus.status === 'expired'
                                    ? 'Upgrade to continue!'
                                    : `${subscriptionStatus.daysRemaining} ${subscriptionStatus.daysRemaining === 1 ? 'day' : 'days'} left in trial`
                                }
                            </p>
                            <Button
                                className="w-full h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] gap-2"
                                onClick={() => window.location.href = '/settings'}
                            >
                                <ArrowUpCircle className="h-3 w-3" />
                                Upgrade Now
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#051c1c]">
                <div className="flex items-center gap-3 p-4 inset-pod rounded-2xl border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                        {initials}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-white truncate font-heading uppercase tracking-widest">{fullName}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">Seedling (Free)</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-zinc-500 hover:text-white hover:bg-white/5"
                        onClick={() => {
                            api.logout();
                            window.location.href = '/login';
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
