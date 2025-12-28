"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { OverviewStats } from '@/components/features/dashboard/overview-stats';
import { RevenueChart } from '@/components/features/dashboard/revenue-chart';
import { RecentActivity } from '@/components/features/dashboard/recent-activity';
import { Button } from '@/components/ui/button';
import { Download, Plus, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { api } from '@/lib/api';
import { getSubscriptionStatus } from '@/lib/subscription-utils';

export default function DashboardPage() {
    const router = useRouter();
    const user = useUser();
    const [stats, setStats] = useState<{
        totalLeads: number;
        activeAppointments: number;
        totalRevenue: number;
        currency: string;
    } | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState(getSubscriptionStatus());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const analyticsData = await api.getAnalyticsSummary();
                setStats(analyticsData);
                setSubscriptionStatus(getSubscriptionStatus());
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const firstName = user?.firstName || 'Friend';

    return (
        <DashboardShell>
            <div className="flex flex-col gap-6">
                {/* Header with Trial/Billing Counter */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h2>
                        <p className="text-muted-foreground italic text-sm">
                            Welcome {firstName}! Here&apos;s your patch status.
                        </p>
                    </div>

                    {/* Trial/Billing Counter - Redesigned */}
                    {subscriptionStatus.plan === 'free' && (
                        <div className={`group relative overflow-hidden rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${subscriptionStatus.daysRemaining <= 3
                                ? 'bg-red-950/30 border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                                : 'bg-primary/10 border-primary/20 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                            }`}>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative px-4 py-2.5">
                                <div className="flex items-center gap-2.5">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-transform group-hover:rotate-12 ${subscriptionStatus.daysRemaining <= 3
                                            ? 'bg-red-500/15 text-red-400'
                                            : 'bg-primary/15 text-primary'
                                        }`}>
                                        <span className="text-lg">⏳</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-0">
                                            {subscriptionStatus.status === 'expired' ? 'Trial Ended' : 'Free Trial'}
                                        </p>
                                        <p className={`text-base font-bold leading-tight ${subscriptionStatus.daysRemaining <= 3 ? 'text-red-400' : 'text-primary'
                                            }`}>
                                            {subscriptionStatus.daysRemaining}
                                            <span className="text-xs ml-1 opacity-75">
                                                {subscriptionStatus.daysRemaining === 1 ? 'Day' : 'Days'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(subscriptionStatus.plan === 'plus' || subscriptionStatus.plan === 'pro') && (
                        <div className="group relative overflow-hidden rounded-xl border bg-primary/10 border-primary/20 hover:border-primary/40 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] cursor-pointer">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative px-4 py-2.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 text-primary transition-transform group-hover:scale-110">
                                        <span className="text-lg">💳</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-0">
                                            Next Billing
                                        </p>
                                        <p className="text-base font-bold text-primary leading-tight">
                                            {subscriptionStatus.daysRemaining}
                                            <span className="text-xs ml-1 opacity-75">
                                                {subscriptionStatus.daysRemaining === 1 ? 'Day' : 'Days'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:flex rounded-xl border-white/5 bg-white/5 hover:bg-white/10 uppercase font-bold tracking-widest text-[10px] h-10 px-6"
                        onClick={() => router.push('/analytics')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Report
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground uppercase font-bold tracking-widest text-[10px] h-10 px-6"
                        onClick={() => router.push('/payments')}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Invoice
                    </Button>
                </div>

                {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                    </div>
                ) : (
                    <>
                        <OverviewStats data={stats} />

                        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                            <div className="lg:col-span-4">
                                <RevenueChart data={[]} />
                            </div>
                            <div className="lg:col-span-3">
                                <RecentActivity activities={[]} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardShell>
    );
}
