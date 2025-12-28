"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { OverviewStats } from '@/components/features/dashboard/overview-stats';
import { RevenueChart } from '@/components/features/dashboard/revenue-chart';
import { RecentActivity } from '@/components/features/dashboard/recent-activity';
import { Button } from '@/components/ui/button';
import { Download, Plus, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<{
        totalLeads: number;
        activeAppointments: number;
        totalRevenue: number;
        currency: string;
    } | undefined>(undefined);
    const [user, setUser] = useState<{ firstName: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsData, userData] = await Promise.all([
                    api.getAnalyticsSummary(),
                    api.getUser()
                ]);
                setStats(analyticsData);
                setUser(userData);
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
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h2>
                        <p className="text-muted-foreground italic text-sm">
                            Welcome {firstName}! Here&apos;s your patch status.
                        </p>
                    </div>
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
