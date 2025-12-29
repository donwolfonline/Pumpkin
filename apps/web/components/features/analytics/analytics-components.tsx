'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { MetricCard } from '@/components/shared/metric-card';
import { DollarSign, Activity, BarChart3, PieChartIcon, FileSignature, Briefcase } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';

const COLORS = ['#f97316', '#f59e0b', '#10b981', '#3b82f6'];

interface AnalyticsStatsProps {
    data?: {
        totalRevenue: number;
        totalLeads: number;
        activeAppointments: number;
        harvestEfficiency?: number;
        revenueChange?: number;
        totalSignedContracts?: number;
        activeProjects?: number;
    };
    isLoading?: boolean;
}

export function AnalyticsStats({ data }: AnalyticsStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Total Revenue"
                value={data?.totalRevenue ?? 0}
                format="currency"
                change={data?.revenueChange ?? 0}
                trend={data?.revenueChange && data.revenueChange >= 0 ? "up" : "down"}
                icon={<DollarSign className="h-4 w-4" />}
            />
            <MetricCard
                title="Signed Contracts"
                value={data?.totalSignedContracts ?? 0}
                change={0}
                trend="neutral"
                icon={<FileSignature className="h-4 w-4" />}
            />
            <MetricCard
                title="Active Projects"
                value={data?.activeProjects ?? 0}
                change={0}
                trend="neutral"
                icon={<Briefcase className="h-4 w-4" />}
            />
            <MetricCard
                title="Harvest Efficiency"
                value={`${data?.harvestEfficiency ?? 0}%`}
                change={0}
                trend="neutral"
                icon={<Activity className="h-4 w-4" />}
            />
        </div>
    )
}

interface ChartData {
    name: string;
    value: number;
    revenue?: number;
    expenses?: number;
    [key: string]: string | number | undefined;
}

interface ChartProps {
    data?: ChartData[];
    isLoading?: boolean;
}

export function DetailedRevenueChart({ data = [] }: ChartProps) {
    const hasData = data.length > 0;

    return (
        <Card className="col-span-4 lg:col-span-3 bg-black/20 border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Revenue vs Expenses</CardTitle>
                <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Historical data across your patch.</CardDescription>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#52525b" />
                            <YAxis tickFormatter={(val) => `$${val}`} fontSize={10} tickLine={false} axisLine={false} stroke="#52525b" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#051c1c', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#f97316" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[350px] flex items-center justify-center">
                        <EmptyState
                            icon={BarChart3}
                            title="Foggy Horizons"
                            description="Historical revenue data will appear here once you've completed a few billing cycles."
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export function CategoryPieChart({ data = [] }: ChartProps) {
    const hasData = data.length > 0;

    return (
        <Card className="col-span-4 lg:col-span-1 bg-black/20 border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#051c1c', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                            {data.map((item, index) => (
                                <div key={item.name} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="text-white">{Math.round(item.value)}%</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="h-[250px] flex items-center justify-center">
                        <EmptyState
                            icon={PieChartIcon}
                            title="No Variety"
                            description="Start categorize your services to see your revenue distribution."
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
