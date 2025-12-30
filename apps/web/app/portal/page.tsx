'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, PortalStats, User } from '@/lib/api';
import { Invoice } from '@/lib/types/invoice';
import { Contract } from '@/lib/types/contract';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/branding/logo';
import {
    FileText,
    CreditCard,
    Clock,
    CheckCircle2,
    LogOut,
    Download,
    ExternalLink,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';

interface DashboardData {
    documents: Contract[];
    invoices: Invoice[];
    stats: PortalStats;
}

import { Suspense } from 'react';

// Separate component for content to be wrapped in Suspense
function ClientDashboardContent() {
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            const dashboardData = await api.getPortalDashboard();
            setData(dashboardData);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const currentUser = api.getUser();
        if (!currentUser || currentUser.role !== 'client') {
            router.push('/portal/login');
            return;
        }
        setUser(currentUser);
        fetchDashboardData();
    }, [router, fetchDashboardData]);

    const handleLogout = () => {
        api.logout();
        router.push('/portal/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_20px_rgba(249,115,22,0.3)]" />
                    <div className="text-center space-y-2">
                        <p className="text-xl font-heading font-bold text-white tracking-tight">Tending your patch...</p>
                        <p className="text-sm text-zinc-500 italic">Preparing your secure workspace</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-gray-100 pb-24">
            {/* Navigation Header */}
            <header className="glass sticky top-0 z-50 border-b border-white/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6 group cursor-pointer transition-transform hover:scale-[1.02]">
                        <Logo iconOnly className="scale-110" />
                        <div className="h-8 w-[1px] bg-white/10" />
                        <div className="flex flex-col">
                            <span className="font-heading font-bold text-xl tracking-tight text-white leading-none">Client Portal</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary opacity-80 mt-1">Secure Workspace</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-sm font-bold text-white leading-none">{user?.firstName} {user?.lastName}</span>
                            <span className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-wider">{user?.email}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10 hidden lg:block" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="h-10 px-4 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all gap-2 border border-transparent hover:border-white/5 group"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-[11px] uppercase tracking-widest">Sign Out</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Welcome Hero */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-10 bg-primary rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Authorized Access</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tighter">
                            Hey, <span className="glow-orange">{user?.firstName}</span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-xl font-medium leading-relaxed">
                            Welcome to your workspace. Manage your financial records and legal documents with ease.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Security Status</p>
                                <p className="text-sm font-bold text-emerald-400">Encrypted & Secure</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Redesigned with Inset Pods */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Pending Payments', value: data?.stats.pendingPayments, icon: CreditCard, color: 'text-orange-400', glow: 'shadow-orange-500/10' },
                        { label: 'Unsigned Docs', value: data?.stats.unsignedDocuments, icon: FileText, color: 'text-blue-400', glow: 'shadow-blue-500/10' },
                        { label: 'Total Vault', value: data?.stats.totalDocuments, icon: ShieldCheck, color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
                        { label: 'Total Received', value: data?.stats.totalInvoices, icon: TrendingUp, color: 'text-purple-400', glow: 'shadow-purple-500/10' },
                    ].map((stat, i) => (
                        <div key={i} className={`inset-pod group p-7 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-2xl ${stat.glow} cursor-default border border-white/[0.03]`}>
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="h-6 w-12 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 opacity-60 leading-none mb-1">{stat.label}</p>
                                <p className="text-3xl font-heading font-bold text-white tracking-tight leading-none">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Hub */}
                <Tabs defaultValue="invoices" className="space-y-10">
                    <div className="flex justify-center">
                        <TabsList className="bg-black/40 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl h-auto shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
                            <TabsTrigger
                                value="invoices"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl py-3 px-10 transition-all font-bold text-[11px] uppercase tracking-[0.2em] relative z-10"
                            >
                                <CreditCard className="w-4 h-4 mr-2" /> Invoices
                            </TabsTrigger>
                            <TabsTrigger
                                value="documents"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl py-3 px-10 transition-all font-bold text-[11px] uppercase tracking-[0.2em] relative z-10"
                            >
                                <FileText className="w-4 h-4 mr-2" /> Legal Vault
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="invoices" className="space-y-4 outline-none">
                        {data?.invoices.length === 0 ? (
                            <div className="inset-pod py-24 text-center rounded-3xl animate-in fade-in zoom-in duration-700 border border-white/[0.03]">
                                <div className="inline-flex p-8 rounded-full bg-white/5 border border-white/5 mb-8 relative">
                                    <CreditCard className="w-16 h-16 text-zinc-800" />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary/20 rounded-full animate-ping" />
                                </div>
                                <h3 className="text-3xl font-heading font-bold text-white mb-3">No invoices yet</h3>
                                <p className="text-zinc-500 max-w-md mx-auto font-medium italic text-lg leading-relaxed">
                                    Your secure billing dashboard is ready. Invoices will appear here once issued by your partner.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5">
                                {data?.invoices.map((invoice, idx) => (
                                    <div
                                        key={invoice.id}
                                        className="bg-black/30 border border-white/5 rounded-3xl p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all group magical-appear relative overflow-hidden"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-16 translate-x-16 group-hover:bg-primary/10 transition-all" />
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all group-hover:rotate-6">
                                                    <CreditCard className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-heading font-bold text-2xl text-white tracking-tight">Invoice #{invoice.invoiceNumber || invoice.id.slice(0, 8).toUpperCase()}</h4>
                                                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                                                        <span className="text-primary/80 px-2 py-0.5 rounded bg-primary/5 uppercase tracking-widest">{invoice.clientCompany || invoice.clientName}</span>
                                                        <span className="opacity-20">•</span>
                                                        <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Issued {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between lg:justify-end gap-12">
                                                <div className="text-left lg:text-right space-y-3">
                                                    <p className="text-3xl font-heading font-bold text-white tracking-tight glow-orange leading-none">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.total || 0)}
                                                    </p>
                                                    <Badge
                                                        className={`rounded-full px-5 py-1.5 font-bold text-[10px] uppercase tracking-[0.2em] border-none shadow-lg ${invoice.status === 'paid'
                                                            ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/5'
                                                            : 'bg-orange-500/10 text-orange-400 shadow-orange-500/5'
                                                            }`}
                                                    >
                                                        {invoice.status}
                                                    </Badge>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 transition-all hover:scale-110 active:scale-95 shadow-xl">
                                                    <Download className="w-6 h-6" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4 outline-none">
                        {data?.documents.length === 0 ? (
                            <div className="inset-pod py-24 text-center rounded-3xl animate-in fade-in zoom-in duration-700 border border-white/[0.03]">
                                <div className="inline-flex p-8 rounded-full bg-white/5 border border-white/5 mb-8">
                                    <FileText className="w-16 h-16 text-zinc-800" />
                                </div>
                                <h3 className="text-3xl font-heading font-bold text-white mb-3">No legal records found</h3>
                                <p className="text-zinc-500 max-w-md mx-auto font-medium italic text-lg leading-relaxed">
                                    Your finalized contracts and legal agreements will be securely archived here for life-long access.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5">
                                {data?.documents.map((doc, idx) => (
                                    <div
                                        key={doc.id}
                                        className="bg-black/30 border border-white/5 rounded-3xl p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all group magical-appear relative overflow-hidden"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -translate-y-16 translate-x-16 group-hover:bg-blue-500/10 transition-all" />
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all group-hover:-rotate-6">
                                                    <FileText className="w-8 h-8 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-heading font-bold text-2xl text-white tracking-tight capitalize">
                                                        Contrat: <span className="opacity-60">{doc.clientCompany || doc.clientName}</span>
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                                                        <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Produced {new Date(doc.createdAt).toLocaleDateString()}</span>
                                                        {doc.signatures && doc.signatures.some(s => s.signedAt) && (
                                                            <>
                                                                <span className="opacity-20">•</span>
                                                                <div className="flex items-center gap-2 text-emerald-400">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    <span>Legally binding</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between lg:justify-end gap-12">
                                                <div className="text-left lg:text-right space-y-3">
                                                    <Badge
                                                        className={`rounded-full px-5 py-1.5 font-bold text-[10px] uppercase tracking-[0.2em] border-none shadow-lg ${doc.status === 'signed'
                                                            ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/5'
                                                            : 'bg-blue-500/10 text-blue-400 shadow-blue-500/5'
                                                            }`}
                                                    >
                                                        {doc.status}
                                                    </Badge>
                                                </div>
                                                <Button variant="ghost" size="icon" asChild className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 transition-all hover:scale-110 active:scale-95 shadow-xl">
                                                    <Link href={`/sign/${doc.id}`} target="_blank">
                                                        <ExternalLink className="w-6 h-6" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Secure Badge */}
                <div className="flex justify-center items-center gap-4 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] py-12 border-t border-white/5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span>Data Integrity Guaranteed</span>
                    <span className="opacity-20">•</span>
                    <span>256-Bit SSL Secured Hub</span>
                </div>
            </main>
        </div>
    );
}

export default function ClientDashboardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_20px_rgba(249,115,22,0.3)]" />
                </div>
            </div>
        }>
            <ClientDashboardContent />
        </Suspense>
    );
}
