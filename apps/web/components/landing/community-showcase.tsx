"use client"

import { Users, Sparkles, MessageSquare, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CommunityShowcase() {
    return (
        <section className="py-24 bg-[#051c1c] relative overflow-hidden text-white border-t border-white/5">
            {/* Background Atmosphere */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Visual Mockup */}
                    <div className="relative group perspective-1000">
                        {/* Glow Details */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent blur-[80px] rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />

                        {/* Browser Window Mockup */}
                        <div className="relative rounded-3xl bg-[#090909] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transform group-hover:-rotate-1 transition-transform duration-700">
                            {/* Window Chrome */}
                            <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-zinc-500/20 border border-zinc-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-zinc-500/20 border border-zinc-500/50" />
                                </div>
                                <div className="ml-4 px-3 py-1 rounded-md bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                                    <Globe className="w-3 h-3 text-emerald-500" />
                                    pumpkin.app/community
                                </div>
                            </div>

                            {/* Window Content - Community Feed Mock */}
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="text-xl font-bold font-heading">Community Hub</div>
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#090909] bg-zinc-800" />
                                        ))}
                                    </div>
                                </div>

                                {/* Post Mock 1 */}
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20" />
                                        <div className="space-y-1">
                                            <div className="h-3 w-24 bg-white/10 rounded" />
                                            <div className="h-2 w-16 bg-white/5 rounded" />
                                        </div>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded" />
                                    <div className="h-4 w-2/3 bg-white/5 rounded" />
                                    <div className="flex gap-4 pt-2">
                                        <div className="h-2 w-10 bg-emerald-500/20 rounded" />
                                        <div className="h-2 w-10 bg-white/5 rounded" />
                                    </div>
                                </div>

                                {/* Post Mock 2 */}
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 opacity-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20" />
                                        <div className="h-3 w-32 bg-white/10 rounded" />
                                    </div>
                                    <div className="h-4 w-4/5 bg-white/5 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] glow-emerald">
                            <Users className="w-3 h-3" />
                            Community Driven
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
                            Grow with the <br />
                            <span className="text-emerald-500">Service Pro Network.</span>
                        </h2>

                        <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
                            Join a thriving ecosystem of service business owners. Share insights, trade tips, and showcase your milestones in our exclusive community hub.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Open Knowledge", desc: "Access business-building strategies shared by experts in the field.", icon: <Sparkles className="w-5 h-5 text-emerald-400" /> },
                                { title: "Guest Access", desc: "A public-facing feed that lets your brand visibility grow organically.", icon: <Globe className="w-5 h-5 text-blue-400" /> },
                                { title: "Collaborative Insights", desc: "Comment, like, and share posts to build your industry presence.", icon: <MessageSquare className="w-5 h-5 text-orange-400" /> },
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

                        <div className="pt-4">
                            <Link
                                href="/community"
                                className="inline-flex items-center gap-2 bg-emerald-500 text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Explore Community
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
