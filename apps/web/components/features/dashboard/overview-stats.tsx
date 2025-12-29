import { MetricCard } from '@/components/shared/metric-card';
import { DollarSign, Briefcase, FileText, FileSignature } from 'lucide-react';

interface OverviewStatsProps {
    data?: {
        totalRevenue: number;
        totalLeads: number;
        revenueChange?: number;
        activeAppointments: number;
        harvestEfficiency?: number;
        totalSignedContracts?: number;
        activeProjects?: number;
    };
    isLoading?: boolean;
}

export function OverviewStats({ data }: OverviewStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Total Revenue"
                value={data?.totalRevenue ?? 0}
                format="currency"
                change={data?.revenueChange ?? 0}
                changeLabel="from last month"
                trend={data?.revenueChange && data.revenueChange >= 0 ? "up" : "down"}
                icon={<DollarSign className="h-4 w-4" />}
            />
            <MetricCard
                title="Signed Contracts"
                value={data?.totalSignedContracts ?? 0}
                change={0}
                changeLabel="active contracts"
                trend="neutral"
                icon={<FileSignature className="h-4 w-4" />}
            />
            <MetricCard
                title="Active Projects"
                value={data?.activeProjects ?? 0}
                change={0}
                changeLabel="in progress"
                trend="neutral"
                icon={<Briefcase className="h-4 w-4" />}
            />
            <MetricCard
                title="Harvest Efficiency"
                value={`${data?.harvestEfficiency ?? 0}%`}
                change={0}
                changeLabel="collection rate"
                trend="neutral"
                icon={<FileText className="h-4 w-4" />}
            />
        </div>
    );
}
