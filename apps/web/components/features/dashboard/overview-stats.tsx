import { MetricCard } from '@/components/shared/metric-card';
import { DollarSign, Users, Briefcase, FileText } from 'lucide-react';

interface OverviewStatsProps {
    data?: {
        totalRevenue: number;
        totalLeads: number;
        activeAppointments: number;
    };
    isLoading?: boolean;
}

export function OverviewStats({ data, isLoading }: OverviewStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Total Revenue"
                value={data?.totalRevenue ?? 0}
                format="currency"
                change={0}
                changeLabel="from last month"
                trend="neutral"
                icon={<DollarSign className="h-4 w-4" />}
            />
            <MetricCard
                title="Inquiries (Leads)"
                value={data?.totalLeads ?? 0}
                change={0}
                changeLabel="new leads"
                trend="neutral"
                icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
                title="Scheduled"
                value={data?.activeAppointments ?? 0}
                change={0}
                changeLabel="this week"
                trend="neutral"
                icon={<Briefcase className="h-4 w-4" />}
            />
            <MetricCard
                title="Pending Invoices"
                value={0}
                change={0}
                changeLabel="needing attention"
                trend="neutral"
                icon={<FileText className="h-4 w-4" />}
            />
        </div>
    );
}
