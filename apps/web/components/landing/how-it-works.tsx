"use client"

import React from 'react';
import { UserPlus, Send, Zap, Banknote, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-[#051c1c] relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">The Workflow</h2>
                    <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight glow-orange">
                        How Pumpkin Works. <br />
                        <span className="text-zinc-600">Pure efficiency.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[70px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 group">
                            <div className="flex flex-col items-center text-center px-4">
                                {/* Icon Pod */}
                                <div className={cn(
                                    "w-36 h-36 rounded-[2.5rem] bg-[#0a2c28] border border-white/5 flex items-center justify-center mb-8 relative transition-all duration-500 group-hover:scale-110 group-hover:border-primary/30 group-hover:shadow-[0_0_50px_rgba(249,115,22,0.15)] shadow-2xl",
                                    "after:absolute after:inset-0 after:rounded-[2.5rem] after:bg-gradient-to-br after:from-white/10 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity"
                                )}>
                                    <div className="text-primary transform group-hover:rotate-12 transition-transform duration-500 scale-150">
                                        {step.icon}
                                    </div>

                                    {/* Step Number */}
                                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-primary text-primary-foreground font-black flex items-center justify-center text-sm shadow-xl">
                                        0{index + 1}
                                    </div>
                                </div>

                                <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors">
                                    {step.title}
                                </h4>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed px-4">
                                    {step.description}
                                </p>

                                {/* Arrow (Mobile) */}
                                {index < steps.length - 1 && (
                                    <div className="md:hidden mt-8 text-white/10 animate-pulse">
                                        <ArrowRight className="h-8 w-8 rotate-90" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Breakdown Card */}
                <div className="mt-32 p-8 md:p-16 rounded-[4rem] bg-[#0a2c28]/50 border border-white/5 backdrop-blur-3xl shadow-3xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="grid lg:grid-cols-2 gap-16 relative z-10 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-8">
                                <Zap className="h-3 w-3 text-primary animate-pulse" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live Demo Performance</span>
                            </div>
                            <h4 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                                Automate the <br />
                                <span className="text-primary italic">Entire Lifecycle.</span>
                            </h4>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-lg">
                                From the first discovery call to the final invoice payment, Pumpkin manages every touchpoint. No more chasing clients for signatures or manually creating spreadsheets.
                            </p>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-3xl font-black text-white mb-2">90%</p>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Faster Proposal Approval</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-white mb-2">12hrs</p>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Average Payment Settlement</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] animate-pulse" />
                            <div className="relative aspect-video rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl flex items-center justify-center p-8 overflow-hidden group/screen">
                                <div className="w-full space-y-4">
                                    <div className="h-4 w-2/3 bg-white/10 rounded-full animate-pulse" />
                                    <div className="h-4 w-full bg-white/5 rounded-full animate-pulse " style={{ animationDelay: '200ms' }} />
                                    <div className="h-4 w-1/2 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                                    <div className="pt-8 flex justify-end">
                                        <div className="w-32 h-10 rounded-xl bg-primary/20 border border-primary/50 animate-pulse" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="bg-white p-3 rounded-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 delay-1000 duration-1000">
                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                            <Banknote className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-zinc-900 leading-none mb-1">Payment Received</p>
                                            <p className="text-xs font-bold text-zinc-400 leading-none">Invoice #INV-2316 settled via Apple Pay</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const steps = [
    {
        title: "Onboard",
        icon: <UserPlus className="h-8 w-8" />,
        description: "Import your contacts and set up your brand identity in seconds."
    },
    {
        title: "Propose",
        icon: <Send className="h-8 w-8" />,
        description: "Generate professional proposals and contracts for digital signing."
    },
    {
        title: "Execute",
        icon: <Zap className="h-8 w-8" />,
        description: "Transform signed proposals into active projects with live tracking."
    },
    {
        title: "Collect",
        icon: <Banknote className="h-8 w-8" />,
        description: "Automated invoicing and high-fidelity payment settling."
    }
];
