import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-primary-foreground',
                secondary: 'border-transparent bg-secondary text-secondary-foreground',
                outline: 'text-foreground',
                success: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 theme-orange:bg-emerald-100',
                warning: 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
                error: 'border-transparent bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
                info: 'border-transparent bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface StatusBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    icon?: React.ReactNode;
}

export function StatusBadge({ className, variant, icon, children, ...props }: StatusBadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), 'gap-1.5', className)} {...props}>
            {icon && <span className="h-3 w-3 shrink-0 flex items-center justify-center">{icon}</span>}
            {children}
        </div>
    );
}

// Helper for invoices
export function InvoiceStatusBadge({ status }: { status: string }) {
    const normalizedStatus = status.toLowerCase();

    const variants: Record<string, "success" | "warning" | "error" | "secondary"> = {
        paid: 'success',
        pending: 'warning',
        overdue: 'error',
        draft: 'secondary',
        canceled: 'secondary',
    };

    const labels: Record<string, string> = {
        paid: 'Paid',
        pending: 'Pending',
        overdue: 'Overdue',
        draft: 'Draft',
        canceled: 'Canceled',
    };

    return (
        <StatusBadge variant={variants[normalizedStatus] || 'secondary'}>
            {labels[normalizedStatus] || status}
        </StatusBadge>
    );
}
