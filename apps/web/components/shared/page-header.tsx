import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick?: () => void;
        href?: string;
        icon?: React.ReactNode;
    };
    breadcrumbs?: Array<{
        label: string;
        href?: string;
    }>;
}

export function PageHeader({
    title,
    description,
    action,
    breadcrumbs,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between pb-8 sm:pb-10 border-b border-white/5 mb-6 sm:mb-8">
            <div className="space-y-3">
                {breadcrumbs && (
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest sm:tracking-[0.3em] mb-2 sm:mb-4">
                        {breadcrumbs.map((crumb, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {crumb.href ? (
                                    <Link href={crumb.href} className="hover:text-primary transition-colors">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-zinc-300">{crumb.label}</span>
                                )}
                                {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 opacity-30" />}
                            </div>
                        ))}
                    </nav>
                )}
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading text-white glow-orange leading-none">{title}</h1>
                {description && (
                    <p className="text-[12px] sm:text-sm font-medium text-zinc-400 max-w-xl leading-relaxed">{description}</p>
                )}
            </div>

            {action && (
                <div className="flex items-center gap-3">
                    {action.href ? (
                        <Button asChild className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                            <Link href={action.href} className="flex items-center text-sm">
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                            </Link>
                        </Button>
                    ) : (
                        <Button onClick={action.onClick} className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] text-sm">
                            {action.icon && <span className="mr-2">{action.icon}</span>}
                            {action.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
