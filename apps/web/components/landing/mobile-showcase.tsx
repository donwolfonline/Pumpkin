"use client"

import { CreditCard, Users, LayoutDashboard, BarChart3 } from "lucide-react";

export function MobileShowcase() {
    return (
        <section className="py-24 bg-[#051c1c] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] glow-orange">
                            Productivity Anywhere
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold font-heading text-white leading-tight">
                            Your Pumpkin Patch <br />
                            <span className="text-primary italic animate-pulse">Now in your pocket.</span>
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-xl">
                            The full power of Pumpkin&apos;s business operating system, optimized for being on the move. Never miss a payment or a lead again.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: <CreditCard className="h-5 w-5" />, title: "Instant Payments", desc: "Swipe to send invoices" },
                                { icon: <Users className="h-5 w-5" />, title: "CRM on the go", desc: "Access client data anywhere" },
                                { icon: <LayoutDashboard className="h-5 w-5" />, title: "Live Overview", desc: "Real-time revenue tracking" },
                                { icon: <BarChart3 className="h-5 w-5" />, title: "Smart Stats", desc: "Automated business insights" }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="h-10 w-10 rounded-xl bg-[#0a2c28] border border-white/5 flex items-center justify-center text-primary shadow-lg">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest leading-none">{item.title}</h4>
                                    <p className="text-xs text-zinc-600 font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex justify-center">
                        {/* 3D Phone Mockup Styling */}
                        <div className="relative w-[300px] h-[600px] bg-[#051c1c] rounded-[3.5rem] border-[8px] border-zinc-800 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-transform hover:rotate-2 hover:scale-105 duration-500 perspective-1000 group">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-20" />

                            {/* App Content Simulation */}
                            <div className="h-full w-full p-4 pt-10 flex flex-col gap-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-[10px] font-bold text-white uppercase tracking-widest">Pumpkin App</div>
                                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">FD</div>
                                </div>

                                {/* Stat Pods in App */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="inset-pod p-3 rounded-2xl border border-white/5">
                                        <div className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Monthly</div>
                                        <div className="text-sm font-bold text-white font-heading">$12.4k</div>
                                    </div>
                                    <div className="inset-pod p-3 rounded-2xl border border-white/5">
                                        <div className="text-[8px] text-zinc-500 uppercase font-bold mb-1">Pending</div>
                                        <div className="text-sm font-bold text-primary font-heading">3</div>
                                    </div>
                                </div>

                                {/* Chart Mock */}
                                <div className="inset-pod h-32 w-full rounded-2xl border border-white/5 p-3 flex items-end gap-1">
                                    {[30, 60, 45, 90, 70, 40, 55].map((h, j) => (
                                        <div key={j} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
                                    ))}
                                </div>

                                {/* Activity List Mock */}
                                <div className="space-y-3 pt-2">
                                    {[1, 2, 3].map((_, k) => (
                                        <div key={k} className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-white/5" />
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 w-20 bg-white/10 rounded-full" />
                                                <div className="h-1.5 w-12 bg-white/5 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Tab Bar */}
                                <div className="mt-auto h-12 w-full border-t border-white/5 flex items-center justify-around gap-2 px-2">
                                    <LayoutDashboard className="h-4 w-4 text-primary" />
                                    <Users className="h-4 w-4 text-zinc-700" />
                                    <CreditCard className="h-4 w-4 text-zinc-700" />
                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                        <span className="text-white text-xl font-bold">+</span>
                                    </div>
                                </div>
                            </div>

                            {/* Glass overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-50" />
                        </div>

                        {/* Back Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -z-10 group-hover:bg-primary/30 transition-all duration-500" />
                    </div>
                </div>
            </div>
        </section>
    );
}
