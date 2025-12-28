export function Brand() {
    return (
        <section className="py-24 bg-[#0a2c28] border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            <div className="mx-auto max-w-3xl px-6 text-center relative z-10">
                <h2 className="text-4xl font-bold font-heading text-white mb-8 glow-orange italic">
                    "Calm. Balanced. Human."
                </h2>
                <p className="text-xl text-zinc-300 leading-relaxed font-medium">
                    Pumpkin was built to feel like the tools you actually want to use.
                    No clutter. No enterprise jargon. Just business management that feels as natural as
                    walking through a pumpkin patch on a cool autumn evening.
                </p>
                <div className="mt-12 flex justify-center gap-4">
                    <span className="text-xs font-bold text-primary uppercase tracking-[0.5em]">Experience the Harmony</span>
                </div>
            </div>
        </section>
    );
}
