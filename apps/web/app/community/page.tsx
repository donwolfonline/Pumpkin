"use client";

import { useEffect, useState } from 'react';
import { api, User } from '@/lib/api';
import { DashboardShell } from '@/components/dashboard-shell';
import { CommunityFeed } from '@/components/features/community/community-feed';
import { Bot, Sparkles, Home, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const currentUser = api.getUser();
        setUser(currentUser);
        setIsCheckingAuth(false);

        const handleAuthUpdate = () => {
            setUser(api.getUser());
        };

        window.addEventListener('user-updated', handleAuthUpdate);
        return () => window.removeEventListener('user-updated', handleAuthUpdate);
    }, []);

    // If user is a provider/admin, they get the full dashboard experience
    if (user && user.role !== 'client') {
        return (
            <DashboardShell>
                <CommunityFeed user={user} />
            </DashboardShell>
        );
    }

    // Guest or Client View (Public Community Layout)
    return (
        <div className="min-h-screen bg-[#051c1c] text-white">
            {/* Simple Top Nav for Public View */}
            <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            🎃
                        </div>
                        <span className="font-heading font-black text-xl tracking-tighter">PUMPKIN</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link
                                    href="/login"
                                    className="text-zinc-400 hover:text-white font-bold text-sm uppercase tracking-widest px-4 py-2 transition-colors flex items-center gap-2"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-primary text-black font-bold text-sm uppercase tracking-widest px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Join
                                </Link>
                            </>
                        ) : (
                            <Link
                                href={user.role === 'client' ? '/portal' : '/dashboard'}
                                className="bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto px-6 relative">
                {/* Background Decorations */}
                <div className="absolute top-20 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-40 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="grid lg:grid-cols-4 gap-12 pt-12">
                    {/* Left Sidebar (Trending/Info) */}
                    <div className="hidden lg:block space-y-8">
                        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Trending Topics
                            </h4>
                            <div className="space-y-4">
                                {['#GrowthMindset', '#ServiceBusiness', '#AutomationTips', '#ClientSuccess'].map(tag => (
                                    <Link key={tag} href="#" className="block text-zinc-400 hover:text-emerald-400 font-bold transition-colors">
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] p-6">
                            <Bot className="w-8 h-8 text-emerald-500 mb-4" />
                            <h4 className="text-lg font-bold text-white mb-2">Grow Together</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Share your milestones, ask for advice, or showcase your latest work. This is our patch.
                            </p>
                        </div>
                    </div>

                    {/* Center Feed */}
                    <div className="lg:col-span-2">
                        <CommunityFeed user={user} />
                    </div>

                    {/* Right Sidebar (Updates/CTA) */}
                    <div className="hidden lg:block space-y-8">
                        <div className="bg-zinc-900 border border-white/5 rounded-[2rem] p-8 overflow-hidden relative group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                            <h3 className="text-xl font-black text-white mb-4 relative z-10 font-heading tracking-tight leading-tight">
                                Want to scale <br />your business?
                            </h3>
                            <p className="text-xs text-zinc-500 mb-6 relative z-10 leading-relaxed font-medium">
                                Get early access to the all-in-one OS built for service pros.
                            </p>
                            <Link
                                href="/register"
                                className="w-full bg-primary text-black font-black text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all relative z-10"
                            >
                                Start Free Trial
                            </Link>
                        </div>

                        <div className="p-4 text-center">
                            <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em]">
                                &copy; {new Date().getFullYear()} Pumpkin Inc
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
