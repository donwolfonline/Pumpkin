import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center gap-3 group shrink-0", className)}>
            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] group-hover:scale-110 transition-transform select-none">
                🎃
            </span>
            {!iconOnly && (
                <span className="text-2xl font-bold tracking-tight font-heading text-white select-none">
                    Pumpkin
                </span>
            )}
        </Link>
    );
}
