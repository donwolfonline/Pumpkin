"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/branding/logo";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        api.logout();
        router.push('/login');
    };

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#051c1c] text-zinc-100 flex flex-col md:flex-row overflow-x-hidden selection:bg-primary/20">
            {/* Desktop Admin Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#051c1c] flex-col fixed h-full z-40">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3">
                        <Logo />
                        <div className="h-6 w-px bg-white/10 mx-1" />
                        <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-primary pt-1">Super Admin</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all relative overflow-hidden group",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(249,115,22,0.1)] border border-primary/20"
                                            : "text-zinc-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-zinc-500")} />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/5 bg-[#051c1c]">
                    <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <div className="h-9 w-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                            SA
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-white truncate font-heading uppercase tracking-widest">System Admin</p>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest truncate">Root Access</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#051c1c] sticky top-0 z-40 backdrop-blur-xl bg-[#051c1c]/80">
                <div className="flex items-center gap-3">
                    <Logo />
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-primary pt-1">Admin</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative min-h-screen">
                {/* Visual Effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 p-4 md:p-10 max-w-7xl mx-auto pb-32">
                    {children}
                </div>
            </main>

            {/* Mobile Navigation (Standardized) */}
            <div className="md:hidden">
                {/* Backdrop for More Menu */}
                <div
                    className={cn(
                        "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* More Menu (Grid Layout) */}
                <div
                    className={cn(
                        "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out w-full max-w-sm px-6",
                        isMobileMenuOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-90 pointer-events-none"
                    )}
                >
                    <div className="grid grid-cols-3 gap-6">
                        {/* Secondary items */}
                        <Link href="/admin/subscriptions" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 group">
                            <div className="h-14 w-14 rounded-full bg-[#0c2a27] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:border-primary/50 group-hover:bg-[#0c2a27]/80 transition-all shadow-lg hover:shadow-primary/20 hover:scale-110">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Subs</span>
                        </Link>
                        <Link href="/admin/analytics" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 group">
                            <div className="h-14 w-14 rounded-full bg-[#0c2a27] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:border-primary/50 group-hover:bg-[#0c2a27]/80 transition-all shadow-lg hover:shadow-primary/20 hover:scale-110">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Analytics</span>
                        </Link>
                        <Link href="/admin/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 group">
                            <div className="h-14 w-14 rounded-full bg-[#0c2a27] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:border-primary/50 group-hover:bg-[#0c2a27]/80 transition-all shadow-lg hover:shadow-primary/20 hover:scale-110">
                                <Settings className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Settings</span>
                        </Link>
                        <button onClick={handleLogout} className="flex flex-col items-center gap-2 group">
                            <div className="h-14 w-14 rounded-full bg-[#0c2a27] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:border-red-500/50 group-hover:bg-[#0c2a27]/80 transition-all shadow-lg hover:shadow-red-500/20 hover:scale-110">
                                <LogOut className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Floating Navigation Pill */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
                    <div className="bg-[#051c1c]/90 backdrop-blur-2xl border border-white/10 rounded-full py-3 px-6 shadow-2xl shadow-black/50">
                        <div className="flex items-center justify-between">
                            {/* Primary Icons directly in bar */}
                            <Link href="/admin" className={cn("flex flex-col items-center justify-center w-12 space-y-1 transition-all", pathname === '/admin' ? "text-primary" : "text-zinc-500 hover:text-white")}>
                                <div className={cn("p-1.5 rounded-full transition-all duration-300", pathname === '/admin' && "bg-primary/10 text-primary transform -translate-y-1")}>
                                    <LayoutDashboard className="h-5 w-5" />
                                </div>
                            </Link>

                            <Link href="/admin/users" className={cn("flex flex-col items-center justify-center w-12 space-y-1 transition-all", pathname === '/admin/users' ? "text-primary" : "text-zinc-500 hover:text-white")}>
                                <div className={cn("p-1.5 rounded-full transition-all duration-300", pathname === '/admin/users' && "bg-primary/10 text-primary transform -translate-y-1")}>
                                    <Users className="h-5 w-5" />
                                </div>
                            </Link>

                            <button
                                type="button"
                                className={cn(
                                    "flex flex-col items-center justify-center w-12 space-y-1 transition-all text-zinc-500 hover:text-white",
                                    isMobileMenuOpen && "text-primary"
                                )}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-full transition-all duration-300",
                                    isMobileMenuOpen ? "bg-primary/10 rotate-90" : ""
                                )}>
                                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
