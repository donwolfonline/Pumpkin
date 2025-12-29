import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden bg-[#051c1c] moonlight">
            {/* Background Decor - Vines/Bubbles style from reference */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-[5%] w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />

                {/* Decorative "Vines" placeholder */}
                <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 1440 800" fill="none">
                    <path d="M-100 200C100 150 200 300 400 250C600 200 800 400 1000 350C1200 300 1400 450 1600 400" stroke="#f97316" strokeWidth="2" strokeDasharray="10 10" />
                    <path d="M1500 600C1300 650 1200 500 1000 550C800 600 600 400 400 450C200 500 0 350 -200 400" stroke="#10b981" strokeWidth="2" strokeDasharray="10 10" />
                </svg>
            </div>

            <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col items-center text-center">
                {/* 3D Pumpkin Mascot (Emoji Stylized) */}
                <div className="relative mb-12 animate-bounce-slow">
                    <div className="absolute inset-x-0 bottom-[-20px] h-10 w-40 bg-black/40 rounded-full blur-xl mx-auto" />
                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-[40px] animate-pulse" />
                    <span className="relative text-9xl sm:text-[12rem] select-none filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]">🎃</span>

                    {/* Expression Overlay (Simple Stylized Eyes) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 mt-2">
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                    </div>
                </div>

                <div className="max-w-4xl">
                    <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-12 font-heading leading-tight glow-orange">
                        Halloween Party in Pumpkin? <br />
                        <span className="text-primary italic animate-glow">호박이~ 넝쿨째~</span>
                    </h1>

                    <p className="text-xl leading-relaxed text-zinc-300 mb-14 text-balance font-medium max-w-2xl mx-auto">
                        Pumpkin is the all-in-one business platform for freelancers and service businesses — manage clients, proposals, contracts, payments, and workflows.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                        <Link href="/register">
                            <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-105 transition-all">
                                🎃 Start Free Now
                            </Button>
                        </Link>
                        <Link href="#how-it-works">
                            <Button size="lg" variant="ghost" className="h-16 px-10 text-xl font-bold rounded-full bg-[#0a2c28] text-white border border-white/10 hover:bg-[#0f403c]">
                                ▶ See How It Works
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-zinc-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            <span>Freelancers Love Us</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            <span>Secure & Fast</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            <span>No Spreadsheets</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator (Stylized Line from reference) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <div className="w-1 h-32 bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
                <span className="text-xs font-bold text-primary animate-bounce">Scroll Down</span>
            </div>
        </section>
    );
}
