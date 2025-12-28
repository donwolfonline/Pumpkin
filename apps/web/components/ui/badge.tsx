import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "success" | "warning" | "error" | "secondary"
}

export const Badge = ({ className = "", variant = "default", ...props }: BadgeProps) => {
    const variants = {
        default: "bg-primary/10 text-primary border-primary/20",
        success: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
        warning: "bg-amber-500/15 text-amber-600 border-amber-500/20",
        error: "bg-rose-500/15 text-rose-600 border-rose-500/20",
        secondary: "bg-secondary text-secondary-foreground border-border"
    }

    return (
        <div
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
            {...props}
        />
    )
}
