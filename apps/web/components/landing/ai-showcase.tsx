"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, Zap, MessageCircle, Heart } from "lucide-react";

export function AIShowcase() {
    return (
        <section className="py-24 bg-[#051c1c] relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2" />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Bot className="w-4 h-4 text-primary" />
                        <span className="text-primary text-xs font-bold uppercase tracking-widest">Intelligent Companion</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-heading mb-6 glow-orange">
                        Meet Pumpkin AI <br />
                        <span className="text-primary italic">Your Business Growth Engine</span>
                    </h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        More than just a chatbot. Pumpkin AI is a proactive assistant that helps you manage leads,
                        draft contracts, and stay motivated throughout the day.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {aiFeatures.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 hover:border-primary/20 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 font-heading">{f.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Interactive Preview Mockup */}
                <div className="mt-20 relative max-w-4xl mx-auto">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                    <div className="relative rounded-[2rem] border border-white/10 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎃</span>
                                <div>
                                    <p className="text-xs font-bold text-white leading-none">Pumpkin AI</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Magic Assistant</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex justify-start">
                                <div className="p-4 rounded-3xl rounded-tl-none bg-white/5 border border-white/10 max-w-[80%]">
                                    <p className="text-sm text-zinc-200">
                                        Hi! I noticed you have 3 unsigned contracts. Should I send a friendly reminder to your clients? 🎃✨
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="p-4 rounded-3xl rounded-tr-none bg-primary text-black font-bold max-w-[80%]">
                                    <p className="text-sm">Yes, please! And tell me a joke while you're at it.</p>
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="p-4 rounded-3xl rounded-tl-none bg-white/5 border border-white/10 max-w-[80%]">
                                    <p className="text-sm text-zinc-200">
                                        Reminders sent! 🚀 And here is your joke: Why did the service provider cross the road? To get to the other side... of the contract! 🥁
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-black/40 border-t border-white/5 flex gap-3">
                            <div className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10" />
                            <div className="w-10 h-10 rounded-xl bg-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const aiFeatures = [
    {
        icon: <Zap className="w-6 h-6 text-primary" />,
        title: "Smart Automation",
        description: "Pumpkin AI monitors your workflows and suggests optimizations, from following up on leads to reminding clients about payments."
    },
    {
        icon: <MessageCircle className="w-6 h-6 text-primary" />,
        title: "Contextual Help",
        description: "Get instant answers about your project status, contract details, or even marketing tips to help you scale faster."
    },
    {
        icon: <Heart className="w-6 h-6 text-primary" />,
        title: "Daily Motivation",
        description: "Running a business is hard. Pumpkin AI is here with motivational quotes, jokes, and coffee break reminders to keep you going."
    }
];
