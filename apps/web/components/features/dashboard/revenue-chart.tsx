'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';

interface RevenueChartProps {
    data?: any[];
}

export function RevenueChart({ data = [] }: RevenueChartProps) {
    const hasData = data.length > 0;

    return (
        <div className="inset-pod p-8 rounded-[3rem] border border-white/5 shadow-2xl min-h-[450px] flex flex-col">
            <div className="mb-8">
                <h3 className="text-xl font-bold font-heading text-white mb-2">Revenue Overview</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Monthly revenue breakdown</p>
            </div>

            <div className="flex-1 w-full pr-4 flex flex-col justify-center">
                {hasData ? (
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#525252"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#525252"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    contentStyle={{
                                        backgroundColor: '#0c2a27',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '1rem',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                        color: '#fff'
                                    }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#f97316"
                                    radius={[6, 6, 0, 0]}
                                    className="drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState
                        icon={BarChart3}
                        title="No Harvest Yet"
                        description="Once you start issuing invoices and receiving payments, your revenue chart will flourish here."
                        actionLabel="Issue First Invoice"
                    />
                )}
            </div>
        </div>
    );
}
