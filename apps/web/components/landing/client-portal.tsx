"use client"

import { ShieldCheck, FileText, CreditCard, Sparkles } from "lucide-react";

export function ClientPortal() {
    return (
        <section className="py-24 bg-[#051c1c] relative overflow-hidden text-white border-t border-white/5">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Content */}
                    <div className="order-2 lg:order-1 space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] glow-orange">
                            <Sparkles className="w-3 h-3" />
                            New Feature
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
                            A Professional Home <br />
                            <span className="text-zinc-500">for your clients.</span>
                        </h2>

                        <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
                            Stop sending loose PDFs and payment links. Give your clients a secure, branded portal to view quotes, pay invoices, and sign contracts—automatically.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Auto-Provisioning", desc: "Clients get magic access the moment you send a document.", icon: <Sparkles className="w-5 h-5 text-orange-400" /> },
                                { title: "Bank-Grade Security", desc: "Encrypted access for sensitive contracts and financial data.", icon: <ShieldCheck className="w-5 h-5 text-emerald-400" /> },
                                { title: "Centralized History", desc: "Every invoice and agreement in one searchable timeline.", icon: <FileText className="w-5 h-5 text-blue-400" /> },
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg tracking-tight mb-1">{feature.title}</h4>
                                        <p className="text-sm text-zinc-400 leading-relaxed font-medium">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual Mockup */}
                    <div className="order-1 lg:order-2 relative group perspective-1000">
                        {/* Glow Details */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent blur-[80px] rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />

                        {/* Browser Window Mockup */}
                        <div className="relative rounded-3xl bg-[#070707] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transform group-hover:rotate-1 transition-transform duration-700">
                            {/* Window Chrome */}
                            <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                                <div className="ml-4 px-3 py-1 rounded-md bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    portal.pumpkin.app
                                </div>
                            </div>

                            {/* Window Content */}
                            <div className="p-8 space-y-6 bg-[url('/grid-pattern.svg')] bg-opacity-5">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Welcome Back</div>
                                        <div className="text-3xl font-bold text-white font-heading">Acme Corp</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-black border-2 border-orange-400">
                                        AC
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="text-2xl font-bold text-white mb-1">3</div>
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pending Invoices</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="text-2xl font-bold text-white mb-1">1</div>
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Unsigned Contract</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Invoice #1024</div>
                                            <div className="text-xs text-orange-400 font-medium">$4,500.00 Due Today</div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-500/20">
                                        Pay Now
                                    </div>
                                </div>

                                <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                                <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
