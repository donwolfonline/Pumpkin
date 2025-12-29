"use client"

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { AnalyticsStats, DetailedRevenueChart, CategoryPieChart } from '@/components/features/analytics/analytics-components';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { ChartDataPoint } from '@/lib/analytics-utils';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<{
        totalRevenue: number;
        totalLeads: number;
        activeAppointments: number;
        harvestEfficiency?: number;
        revenueChange?: number;
        totalSignedContracts?: number;
        activeProjects?: number;
    } | undefined>(undefined);
    const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
    const [categoryData, setCategoryData] = useState<ChartDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Load analytics modules
                const { getRevenueChartData, getCategoryDistribution } = await import('@/lib/analytics-utils');

                const data = await api.getAnalyticsSummary();
                setStats(data);

                setRevenueData(getRevenueChartData());
                setCategoryData(getCategoryDistribution());
            } catch (error) {
                console.error('Failed to fetch analytics stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <DashboardShell>
            <PageHeader
                title="Patch Analytics"
                description="Deep dive into your business performance."
                action={{
                    label: 'Export Report',
                    icon: <Download className="h-4 w-4" />,
                    onClick: () => console.log('Export')
                }}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Analytics' }
                ]}
            />

            <div className="flex items-center justify-end mb-6">
                <Button variant="ghost" size="sm" className="bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest px-4 h-10">
                    <Calendar className="mr-2 h-4 w-4" />
                    Last 30 Days
                </Button>
            </div>

            <div className="space-y-8">
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                    </div>
                ) : (
                    <>
                        <AnalyticsStats data={stats} />
                        <div className="grid gap-6 md:grid-cols-4">
                            <DetailedRevenueChart data={revenueData} isLoading={isLoading} />
                            <CategoryPieChart data={categoryData} isLoading={isLoading} />
                        </div>
                    </>
                )}
            </div>
        </DashboardShell>
    );
}
