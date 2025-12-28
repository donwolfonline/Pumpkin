import { Skull } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#051c1c]">
            <div className="flex flex-col items-center gap-4 animate-[magical-appear_1s_ease-out_infinite_alternate]">
                <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full animate-pulse" />
                    <Skull className="h-16 w-16 text-primary relative z-10 animate-[bounce_3s_infinite]" />
                </div>
                <p className="text-primary font-heading uppercase tracking-[0.3em] text-xs font-bold animate-pulse">
                    Summoning...
                </p>
            </div>
        </div>
    );
}
