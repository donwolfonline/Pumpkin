export function PumpkinLineup() {
    return (
        <section className="py-24 bg-[#051c1c] relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 text-center">
                <h2 className="text-2xl font-bold font-heading text-white mb-16 glow-orange uppercase tracking-widest">
                    Meet the Team
                </h2>

                <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
                    {mascots.map((m, i) => (
                        <div key={i} className="group flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="absolute inset-x-0 bottom-[-5px] h-4 w-16 bg-black/40 rounded-full blur-md mx-auto" />
                                <span className="text-8xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-125 transition-transform duration-500 cursor-help block">
                                    {m.emoji}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest group-hover:text-primary transition-colors">
                                {m.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-20">
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-12 py-4 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all">
                        Select Your Pumpkin
                    </button>
                </div>
            </div>
        </section>
    );
}

const mascots = [
    { emoji: "🎃", label: "Hero" },
    { emoji: "👻", label: "Shadow" },
    { emoji: "🦉", label: "Wise" },
    { emoji: "🐱", label: "Agile" },
    { emoji: "🦇", label: "Fast" },
]
