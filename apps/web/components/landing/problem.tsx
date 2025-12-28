import { XCircle } from "lucide-react";

export function Problem() {
    return (
        <section className="py-24 bg-[#051c1c] relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-heading mb-6 glow-orange">
                        Business software is a nightmare.
                    </h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        You’re stitching together five different apps just to get paid.
                        It’s expensive, it’s messy, and it’s keeping you from actually working.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="inset-pod p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                                <XCircle className="w-6 h-6 text-red-400 opacity-50" />
                            </div>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Multi-Tool Chaos</p>
                            <p className="text-zinc-300 font-medium">Scattered data & <br /> forgotten invoices</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
