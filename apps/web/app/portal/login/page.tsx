'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Logo } from '@/components/branding/logo';

function ClientLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleSimulatedLogin = async (loginEmail: string) => {
        setLoading(true);
        // Fake delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));

        // Create simulated client user
        const fakeUser = {
            id: 'client_' + Math.random().toString(36).substr(2, 9),
            email: loginEmail,
            firstName: 'Client',
            lastName: 'User',
            role: 'client',
            organizationId: 'demo_org',
            avatar: undefined
        };

        // Set simulation session
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', 'simulated_client_token');
            localStorage.setItem('user', JSON.stringify(fakeUser));
            window.dispatchEvent(new CustomEvent('user-updated'));
        }

        router.push('/portal');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.login(email, password);
            if (response.user.role !== 'client') {
                api.logout();
                setError('This portal is for clients only. Please use the main login page.');
                return;
            }
            router.push('/portal');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md z-10 space-y-8">
            {/* Logo & Header */}
            <div className="flex flex-col items-center space-y-4 mb-8">
                <Logo className="scale-125 hover:scale-125" />
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight font-heading text-white flex items-center justify-center gap-3">
                        Client Portal <Sparkles className="w-6 h-6 text-orange-400 animate-pulse" />
                    </h1>
                    <p className="text-zinc-400 font-medium tracking-wide">Secure access to your documents and invoices</p>
                </div>
            </div>

            {/* Main Card - Matching 'Inset Pod' Style */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden rounded-[2.5rem] inset-pod">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 opacity-50" />

                <CardHeader className="space-y-2 pt-10 px-8 text-center">
                    <CardTitle className="text-2xl font-bold text-white tracking-tight">Login</CardTitle>
                    <CardDescription className="text-zinc-500 font-medium tracking-wide text-xs uppercase">
                        Enter the credentials sent to your email
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-orange-400 transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-14 pl-12 bg-black/20 border-white/10 rounded-2xl focus:ring-orange-500/50 text-white placeholder:text-zinc-600 transition-all font-medium focus:border-orange-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-2">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Password</Label>
                                    <Link href="#" className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors uppercase tracking-wider">Forgot?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-orange-400 transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-14 pl-12 bg-black/20 border-white/10 rounded-2xl focus:ring-orange-500/50 text-white placeholder:text-zinc-600 transition-all font-medium focus:border-orange-500/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold h-14 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_25px_rgba(255,107,0,0.3)] hover:scale-[1.02] disabled:opacity-70 group mt-4 text-base"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Access Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Escaped apostrophe here */}
            <p className="text-center text-zinc-500 text-sm font-medium">
                Don&apos;t have access? Ask your service provider to share a document.
            </p>

            <div className="flex justify-center pt-2">
                <Link href="/login" className="px-6 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-all flex items-center gap-2">
                    Provider Login
                </Link>
            </div>
        </div>
    );
}

export default function ClientLoginPage() {
    return (
        <div className="min-h-screen bg-[#051c1c] flex flex-col items-center justify-center p-4 relative overflow-hidden text-white selection:bg-orange-500/20">
            {/* Background Decorative Elements - Matching Main Login Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] inset-x-0 flex justify-center opacity-20 filter blur-[120px]">
                    <div className="w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-screen animate-pulse duration-1000" />
                </div>
            </div>

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <ClientLoginForm />
            </Suspense>
        </div>
    );
}
