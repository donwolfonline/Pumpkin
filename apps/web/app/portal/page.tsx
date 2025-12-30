'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, PortalStats, User } from '@/lib/api';
import { Invoice } from '@/lib/types/invoice';
import { Contract } from '@/lib/types/contract';
import { Project } from '@/lib/types/project';
import { Proposal } from '@/lib/types/proposal';
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
    ShieldCheck,
    GitBranch
} from 'lucide-react';

interface DashboardData {
    documents: Contract[];
    invoices: Invoice[];
    projects: Project[];
    proposals: Proposal[];
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
            // If API fails, set empty data to allow UI to render empty states
            setData({
                documents: [],
                invoices: [],
                projects: [],
                proposals: [],
                stats: {
                    totalDocuments: 0,
                    totalInvoices: 0,
                    totalProjects: 0,
                    totalProposals: 0,
                    pendingPayments: 0,
                    unsignedDocuments: 0
                }
            });
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
                <div className="container mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-6 group cursor-pointer transition-transform hover:scale-[1.02]">
                        <Logo iconOnly className="scale-110" />
                        <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                        <div className="flex flex-col sm:flex">
                            <span className="font-heading font-bold text-base sm:text-xl tracking-tight text-white leading-none">Client Portal</span>
                            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-primary opacity-80 mt-1">Secure Workspace</span>
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

            <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Welcome Hero - Compacted for mobile */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 sm:pb-12">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Authorized Access</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-white tracking-tighter">
                            Hey, <span className="glow-orange">{user?.firstName}</span>
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl font-medium leading-relaxed">
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

                {/* Stats Grid - More compact on mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {[
                        { label: 'Projects', value: data?.stats.totalProjects || 0, icon: GitBranch, color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
                        { label: 'Proposals', value: data?.stats.totalProposals || 0, icon: FileText, color: 'text-blue-400', glow: 'shadow-blue-500/10' },
                        { label: 'Payments', value: data?.stats.pendingPayments || 0, icon: CreditCard, color: 'text-orange-400', glow: 'shadow-orange-500/10' },
                        { label: 'Legal Vault', value: data?.stats.unsignedDocuments || 0, icon: ShieldCheck, color: 'text-purple-400', glow: 'shadow-purple-500/10' },
                    ].map((stat, i) => (
                        <div key={i} className={`inset-pod group p-4 sm:p-7 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-2xl ${stat.glow} cursor-default border border-white/[0.03] relative overflow-hidden`}>
                            <div className="flex items-start justify-between mb-3 sm:mb-6">
                                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all ${stat.color}`}>
                                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                                </div>
                                <div className="hidden sm:flex h-6 w-12 rounded-full bg-white/5 items-center justify-center overflow-hidden border border-white/5">
                                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                                </div>
                            </div>
                            <div className="space-y-0.5 sm:space-y-1 relative z-10">
                                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-zinc-500 opacity-60 leading-none mb-1">{stat.label}</p>
                                <p className="text-xl sm:text-3xl font-heading font-bold text-white tracking-tight leading-none">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Hub - Sticky Segmented Control */}
                <Tabs defaultValue="projects" className="space-y-6 sm:space-y-10">
                    <div className="sticky top-20 z-40 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 bg-black/50 backdrop-blur-md border-b border-white/5 sm:border-none sm:bg-transparent sm:backdrop-blur-none sm:static">
                        <div className="flex justify-start overflow-x-auto no-scrollbar">
                            <TabsList className="bg-white/5 sm:bg-black/40 backdrop-blur-xl border border-white/10 sm:border-white/5 p-1 rounded-xl sm:rounded-2xl h-auto shadow-2xl relative flex whitespace-nowrap min-w-max mx-auto sm:mx-0">
                                <TabsTrigger
                                    value="projects"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg sm:rounded-xl py-2 sm:py-3 px-4 sm:px-8 transition-all font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] relative z-10"
                                >
                                    <GitBranch className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Projects
                                </TabsTrigger>
                                <TabsTrigger
                                    value="proposals"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg sm:rounded-xl py-2 sm:py-3 px-4 sm:px-8 transition-all font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] relative z-10"
                                >
                                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Proposals
                                </TabsTrigger>
                                <TabsTrigger
                                    value="invoices"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg sm:rounded-xl py-2 sm:py-3 px-4 sm:px-8 transition-all font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] relative z-10"
                                >
                                    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Invoices
                                </TabsTrigger>
                                <TabsTrigger
                                    value="documents"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg sm:rounded-xl py-2 sm:py-3 px-4 sm:px-8 transition-all font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] relative z-10"
                                >
                                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Legal Vault
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    <TabsContent value="projects" className="space-y-4 outline-none">
                        {data?.projects.length === 0 ? (
                            <div className="inset-pod py-24 text-center rounded-3xl animate-in fade-in zoom-in duration-700 border border-white/[0.03]">
                                <div className="inline-flex p-8 rounded-full bg-white/5 border border-white/5 mb-8">
                                    <GitBranch className="w-16 h-16 text-zinc-800" />
                                </div>
                                <h3 className="text-3xl font-heading font-bold text-white mb-3">No active projects</h3>
                                <p className="text-zinc-500 max-w-md mx-auto font-medium italic text-lg leading-relaxed">
                                    Collaborative projects will appear here once initiated by your partner.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {data?.projects.map((project, idx) => (
                                    <div
                                        key={project.id}
                                        className="bg-black/30 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all group magical-appear relative overflow-hidden"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500/5 blur-3xl rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 group-hover:bg-emerald-500/10 transition-all" />
                                        <div className="flex flex-col gap-4 sm:gap-6 relative z-10">
                                            <div className="flex flex-row items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all shrink-0">
                                                        <GitBranch className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-heading font-bold text-base sm:text-xl text-white tracking-tight truncate">{project.name}</h4>
                                                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500">{project.status}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-white/5 text-zinc-400 border-white/5 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] uppercase tracking-tighter shrink-0">
                                                    {project.priority}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 sm:space-y-4">
                                                <div className="flex justify-between text-[9px] sm:text-[11px] font-bold uppercase tracking-widest">
                                                    <span className="text-zinc-500">Progress</span>
                                                    <span className="text-emerald-400">{project.progress}%</span>
                                                </div>
                                                <div className="h-1.5 sm:h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex -space-x-1.5 sm:-space-x-2">
                                                    {project.team?.slice(0, 3).map((member, i) => (
                                                        <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-[7px] sm:text-[8px] text-white">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="proposals" className="space-y-4 outline-none">
                        {data?.proposals.length === 0 ? (
                            <div className="inset-pod py-24 text-center rounded-3xl animate-in fade-in zoom-in duration-700 border border-white/[0.03]">
                                <div className="inline-flex p-8 rounded-full bg-white/5 border border-white/5 mb-8">
                                    <FileText className="w-16 h-16 text-zinc-800" />
                                </div>
                                <h3 className="text-3xl font-heading font-bold text-white mb-3">No proposals found</h3>
                                <p className="text-zinc-500 max-w-md mx-auto font-medium italic text-lg leading-relaxed">
                                    New opportunities and project proposals will appear here for your review and approval.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5">
                                {data?.proposals.map((proposal, idx) => (
                                    <div
                                        key={proposal.id}
                                        className="bg-black/30 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all group magical-appear relative overflow-hidden"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/5 blur-3xl rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 group-hover:bg-blue-500/10 transition-all" />
                                        <div className="flex flex-col gap-4 sm:gap-6 relative z-10">
                                            <div className="flex items-center gap-3 sm:gap-8">
                                                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/5 rounded-lg sm:rounded-2xl border border-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all shrink-0">
                                                    <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-blue-400" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-heading font-bold text-base sm:text-2xl text-white tracking-tight truncate">{proposal.title}</h4>
                                                    <div className="flex items-center gap-2 text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                                                        <Clock className="w-3 h-3" /> {new Date(proposal.createdAt || '').toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 pt-2">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                                    <span className="text-blue-400 font-heading text-base sm:text-xl font-bold tracking-tight">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(proposal.totalAmount || 0)}
                                                    </span>
                                                    <Badge
                                                        className={`w-fit rounded-full px-2 sm:px-5 py-0.5 sm:py-1.5 font-bold text-[8px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] border-none ${proposal.status === 'accepted' || proposal.status === 'signed'
                                                            ? 'bg-emerald-500/10 text-emerald-400'
                                                            : 'bg-blue-500/10 text-blue-400'
                                                            }`}
                                                    >
                                                        {proposal.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {(proposal.status === 'sent' || proposal.status === 'viewed') && (
                                                        <Button variant="ghost" size="icon" asChild className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 shadow-xl">
                                                            <Link href={`/proposal/${proposal.id}`} target="_blank">
                                                                <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 shadow-xl">
                                                        <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

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
                                        className="bg-black/30 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all group magical-appear relative overflow-hidden"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-primary/5 blur-3xl rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 group-hover:bg-primary/10 transition-all" />
                                        <div className="flex flex-col gap-4 sm:gap-6 relative z-10">
                                            <div className="flex items-center gap-3 sm:gap-8">
                                                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/5 rounded-lg sm:rounded-2xl border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all shrink-0">
                                                    <CreditCard className="w-5 h-5 sm:w-8 sm:h-8 text-primary font-bold" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-heading font-bold text-base sm:text-2xl text-white tracking-tight truncate">Invoice #{invoice.invoiceNumber || invoice.id.slice(0, 8).toUpperCase()}</h4>
                                                    <div className="flex items-center gap-2 text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                                                        <span className="text-primary/80 truncate max-w-[100px] sm:max-w-none">{invoice.clientCompany || invoice.clientName}</span>
                                                        <span className="opacity-20">•</span>
                                                        <Clock className="w-3 h-3" /> {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 pt-2">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                                    <span className="text-primary font-heading text-base sm:text-xl font-bold tracking-tight glow-orange">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.total || 0)}
                                                    </span>
                                                    <Badge
                                                        className={`w-fit rounded-full px-2 sm:px-5 py-0.5 sm:py-1.5 font-bold text-[8px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] border-none ${invoice.status === 'paid'
                                                            ? 'bg-emerald-500/10 text-emerald-400'
                                                            : 'bg-orange-500/10 text-orange-400'
                                                            }`}
                                                    >
                                                        {invoice.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {invoice.status !== 'paid' && (
                                                        <Button variant="ghost" size="icon" asChild className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 shadow-xl">
                                                            <Link href={`/invoice/${invoice.id}`} target="_blank">
                                                                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 shadow-xl">
                                                        <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    </Button>
                                                </div>
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
                                        className="bg-black/30 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all group magical-appear relative overflow-hidden"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/5 blur-3xl rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 group-hover:bg-blue-500/10 transition-all" />
                                        <div className="flex flex-col gap-4 sm:gap-6 relative z-10">
                                            <div className="flex items-center gap-3 sm:gap-8">
                                                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/5 rounded-lg sm:rounded-2xl border border-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all shrink-0">
                                                    <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-blue-400" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-heading font-bold text-base sm:text-2xl text-white tracking-tight truncate">
                                                        Contract: <span className="opacity-60">{doc.clientCompany || doc.clientName}</span>
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                                                        <Clock className="w-3 h-3" /> {new Date(doc.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 pt-2">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                                    <Badge
                                                        className={`w-fit rounded-full px-2 sm:px-5 py-0.5 sm:py-1.5 font-bold text-[8px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] border-none ${doc.status === 'signed'
                                                            ? 'bg-emerald-500/10 text-emerald-400'
                                                            : 'bg-blue-500/10 text-blue-400'
                                                            }`}
                                                    >
                                                        {doc.status}
                                                    </Badge>
                                                    {doc.signatures && doc.signatures.some(s => s.signedAt) && (
                                                        <div className="flex items-center gap-1 text-emerald-400 text-[7px] sm:text-[9px] font-bold uppercase tracking-wider">
                                                            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 h-3" />
                                                            <span>Binding</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {doc.status !== 'signed' && (
                                                        <Button variant="ghost" size="icon" asChild className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-xl">
                                                            <Link href={`/sign/${doc.id}`} target="_blank">
                                                                <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 shadow-xl">
                                                        <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs >

                {/* Secure Badge */}
                < div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] py-12 border-t border-white/5" >
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span>Data Integrity Guaranteed</span>
                    </div>
                    <span className="hidden sm:inline opacity-20">•</span>
                    <span>256-Bit SSL Secured Hub</span>
                </div >
            </main >
        </div >
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
