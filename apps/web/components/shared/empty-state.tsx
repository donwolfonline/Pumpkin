import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = ""
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center p-12 text-center rounded-[2rem] border border-dashed border-white/5 bg-white/[0.02] text-white ${className}`}>
            <div className="h-16 w-16 rounded-2xl bg-[#0a2c28] border border-white/5 flex items-center justify-center text-primary/40 mb-6 shadow-inner">
                <Icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading mb-2">{title}</h3>
            <p className="text-sm text-zinc-500 max-w-xs mb-8">
                {description}
            </p>
            {actionLabel && (
                <Button
                    onClick={onAction}
                    variant="outline"
                    className="h-11 rounded-xl bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px]"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
