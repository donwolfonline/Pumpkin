import { Button } from "@/components/ui/button";

export function CTA() {
    return (
        <section className="py-32 bg-[#0a2c28] relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            {/* Large Ghost Mascot (Emoji stylized) */}
            <div className="absolute -bottom-20 -left-20 text-[20rem] opacity-10 filter blur-sm">👻</div>
            <div className="absolute -top-20 -right-20 text-[20rem] opacity-10 filter blur-sm">🎃</div>

            <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-heading mb-6 glow-orange">
                    Join the Pumpkin Party.
                </h2>
                <div className="text-xl text-zinc-400 mb-12 space-y-2">
                    <p>Your business deserves better tools.</p>
                    <p className="font-bold text-white uppercase tracking-widest text-sm">Start running your business with clarity.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:scale-105 transition-all">
                        Get Started Free
                    </Button>
                    <Button size="lg" variant="ghost" className="h-16 px-12 text-xl font-bold rounded-full text-white border border-white/5 bg-white/5 hover:bg-white/10">
                        Book a Demo
                    </Button>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 opacity-50">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">No Credit Card</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Cancel Anytime</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">GDPR Ready</span>
                </div>
            </div>
        </section>
    );
}
