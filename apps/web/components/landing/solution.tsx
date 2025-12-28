import { CheckCircle2 } from "lucide-react";

export function Solution() {
    return (
        <section className="py-24 bg-[#0a2c28] border-y border-white/5 relative overflow-hidden">
            {/* Moon-like gradient effect */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-square max-w-md mx-auto">
                        {/* 3D-ish Pumpkin (Emoji stylized) */}
                        <div className="absolute inset-0 bg-primary/20 blur-[80px] animate-pulse rounded-full" />
                        <div className="relative flex items-center justify-center h-full">
                            <span className="text-[12rem] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-bounce-slow">🎃</span>
                            {/* Floating icons around */}
                            <div className="absolute top-10 right-10 text-4xl animate-float delay-700">📜</div>
                            <div className="absolute bottom-20 left-0 text-4xl animate-float">💰</div>
                            <div className="absolute top-1/2 -right-10 text-4xl animate-float delay-1000">🤝</div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-heading mb-6 leading-tight glow-orange">
                            One calm platform. <br />
                            <span className="text-primary italic">No more app-switching.</span>
                        </h2>
                        <p className="text-lg text-zinc-400 mb-8 max-w-xl">
                            Pumpkin replaces your CRM, proposal software, invoicing tool, and scheduler.
                            It’s the single source of truth for your business.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Manage clients and leads in one place",
                                "Send professional proposals that close",
                                "Get paid faster with integrated billing",
                                "Automate your busywork effortlessly"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-zinc-300 font-medium">
                                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
