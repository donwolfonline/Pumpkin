import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';

export interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    format?: 'currency' | 'number' | 'compact';
    className?: string;
}

export function MetricCard({
    title,
    value,
    change,
    changeLabel,
    icon,
    trend = 'neutral',
    format = 'number',
    className,
}: MetricCardProps) {
    const isPositive = trend === 'up';
    const isNegative = trend === 'down';

    let formattedValue = value;
    if (typeof value === 'number') {
        if (format === 'currency') formattedValue = formatCurrency(value);
        else if (format === 'compact') formattedValue = formatCompactNumber(value);
        else formattedValue = value.toLocaleString();
    }

    return (
        <div className={cn('inset-pod p-6 rounded-3xl border border-white/5 shadow-2xl group hover:scale-[1.02] transition-all', className)}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{title}</p>
                {icon && <div className="text-primary h-4 w-4 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">{icon}</div>}
            </div>
            <div>
                <div className="text-2xl font-bold font-heading text-white tracking-tight">{formattedValue}</div>
                {(change !== undefined || changeLabel) && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-1 mt-2">
                        {change !== undefined && (
                            <span
                                className={cn(
                                    'flex items-center',
                                    isPositive && 'text-emerald-500',
                                    isNegative && 'text-rose-500',
                                    trend === 'neutral' && 'text-zinc-600'
                                )}
                            >
                                {isPositive && <ArrowUpIcon className="h-3 w-3 mr-0.5" />}
                                {isNegative && <ArrowDownIcon className="h-3 w-3 mr-0.5" />}
                                {trend === 'neutral' && <MinusIcon className="h-3 w-3 mr-0.5" />}
                                {Math.abs(change)}%
                            </span>
                        )}
                        {changeLabel && <span>{changeLabel}</span>}
                    </p>
                )}
            </div>
        </div>
    );
}
