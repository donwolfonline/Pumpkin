"use client";

import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, MessageCircle, Heart, Zap, Coffee, ArrowRight, Home, Layout, CreditCard, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
    id: string;
    text: string;
    sender: "assistant" | "user";
    timestamp: number;
}

// Separate KNOWLEDGE_BASE with randomized response support
const KNOWLEDGE_BASE = [
    {
        keywords: ["project", "create", "new", "start"],
        answers: ["To create a project, go to the **Projects** tab in your sidebar, click the **+ New Project** button at the top right, and follow the simple setup guide! 🚀"]
    },
    {
        keywords: ["task", "add", "todo", "todo list"],
        answers: ["You can add tasks by opening any active project and clicking **Add Task**. You can assign due dates, priority, and even attach files to keep everything organized. ✅"]
    },
    {
        keywords: ["contract", "legal", "template", "signature"],
        answers: ["Creating a contract is easy! Head to **Legal Vault**, select **New Contract**, and choose one of our verified templates. You can then send it to your client for an electronic signature. ✍️"]
    },
    {
        keywords: ["website", "build", "site", "design", "page"],
        answers: ["Pumpkin's Website Builder lets you launch a professional site in minutes. Go to **Website**, choose your theme, and add your products or services. Your site is hosted on a unique `[subdomain].pumpkin.app` URL! 🌐"]
    },
    {
        keywords: ["crm", "contact", "lead", "client"],
        answers: ["Manage your relationships in the **CRM** tab. You can add leads manually or they'll be automatically generated when someone contacts you through your public website. 👥"]
    },
    {
        keywords: ["invoice", "pay", "billing", "money"],
        answers: ["Invoices are tracked under **Billing**. You can create professional invoices, send them to clients, and track payment status in real-time. Paid invoices appear automatically. 💰"]
    },
    {
        keywords: ["what is", "about", "pumpkin", "platform", "purpose"],
        answers: ["**Pumpkin** is the all-in-one operating system for modern service businesses. We help you manage your entire workflow—from first contact to final payment—in one beautiful interface. 🎃"]
    },
    {
        keywords: ["price", "cost", "plan", "free", "subscription"],
        answers: ["We have plans for every stage! Start with our **Seedling (Free)** plan to explore, or level up to **Sprout ($29/mo)** or **Harvest ($79/mo)** for pro features like custom domains and advanced analytics. [View Pricing](/pricing)"]
    },
    {
        keywords: ["sign up", "register", "create account", "join"],
        answers: ["Joining the party is easy! Just click the **Get Started** button on our landing page or go directly to our [Register Page](/register). You'll get a 14-day free trial of our pro features! 🎁"]
    },
    {
        keywords: ["login", "sign in", "access", "account"],
        answers: ["Already have a pumpkin patch? Head over to the [Login Page](/login) to get back to work. If you're a client, use the [Portal Login](/portal/login)! 🔑"]
    },
    {
        keywords: ["hi", "hello", "who", "pumpkin"],
        answers: [
            "Hi! I'm **Pumpkin**, your AI companion. I'm here to help you navigate the platform and grow your service business. Ask me anything about projects, contracts, or your website! 🎃",
            "Hey there! Ready to grow your business? I'm Pumpkin, and I'm here to help you harvest some success today! 🚜",
            "Greetings! I'm Pumpkin. How can I assist you with your professional workflow today? ✨"
        ]
    },
    {
        keywords: ["joke", "funny", "laugh"],
        answers: [
            "Why did the service provider cross the road? To get to the other side... of the contract! Badum-tss! 🥁",
            "What do you call a pumpkin that can fix anything? A **Patch** master! 🎃🔧",
            "Why was the CRM always so happy? Because it had so many great connections! 👥✨",
            "Why did the entrepreneur bring a ladder to work? Because they wanted to reach the top of the growth chart! 📈",
            "How does a pumpkin listen to music? With **Squash**-ify! 🎵🎃"
        ]
    },
    {
        keywords: ["motivation", "inspire", "quote", "inspiration"],
        answers: [
            "The best way to predict the future is to create it. And you're doing exactly that with **Pumpkin**! Keep pushing! 💪✨",
            "Small progress is still progress. Every invoice sent and every task completed is a step toward your big harvest! 🌾",
            "Your passion is what grows your business. My job is just to provide the best soil! Let's get to work. 🚀",
            "Don't count the days, make the days count. Especially the ones where you close a big contract! ✍️💎",
            "The secret of getting ahead is getting started. Good thing you've already started with Pumpkin! 🎃🔥"
        ]
    },
    {
        keywords: ["secret", "hidden"],
        answers: [
            "Psst... did you know you can customize your website's URL structure in the Design tab? It's a great way to boost your SEO! 🤫",
            "Hidden tip: You can drag me anywhere on the screen if I'm in your way. I'm flexible! 🎃💨"
        ]
    },
    {
        keywords: ["coffee", "break", "rest"],
        answers: [
            "You've been working hard! Maybe it's time for a coffee break? ☕️ I'll be right here when you get back!",
            "A well-rested entrepreneur is a productive one. Take 5 minutes, stretch, and grab a tea! 🫖✨",
            "Branding tip: Coffee tastes better when you know your backend is organized. Take a break! ☕️✅"
        ]
    }
];

const DEFAULT_ANSWERS = [
    "I'm still learning about that! You can try asking about 'what is pumpkin', 'pricing', or 'how to create a project'. Or just tell me a joke! 👋",
    "Hmm, I'm not quite sure about that one yet. Can you try rephrasing? I love talking about CRM and projects! 🎃",
    "I'm a growing AI! Not sure I have the answer to that yet, but I can tell you a joke if you're bored! 🥁"
];

// Memoized Message Component for Performance
const ChatMessage = memo(({ msg, onLinkClick }: { msg: Message, onLinkClick: (href: string) => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className={cn(
                "flex flex-col max-w-[85%]",
                msg.sender === "user" ? "ml-auto items-end" : "items-start"
            )}
        >
            <div
                className={cn(
                    "p-4 rounded-3xl text-sm leading-relaxed shadow-xl",
                    msg.sender === "user"
                        ? "bg-emerald-500 text-black font-bold rounded-tr-none"
                        : "bg-white/5 text-zinc-200 border border-white/10 rounded-tl-none backdrop-blur-md"
                )}
            >
                {msg.text.split("**").map((part, i) => (
                    i % 2 === 1 ? <strong key={i} className="text-white font-black">{part}</strong> : part
                ))}

                {msg.sender === "assistant" && msg.text.includes("[") && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                        {msg.text.match(/\[(.*?)\]\((.*?)\)/g)?.map((match, i) => {
                            const [_, label, href] = match.match(/\[(.*?)\]\((.*?)\)/) || [];
                            return (
                                <Button
                                    key={i}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-full bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                                    onClick={() => onLinkClick(href)}
                                >
                                    {label}
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
            <span className="text-[9px] text-zinc-600 mt-1.5 px-2 uppercase font-bold tracking-tighter opacity-50">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </motion.div>
    );
});

ChatMessage.displayName = "ChatMessage";

export function PumpkinAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: crypto.randomUUID(),
            text: "Hi! I'm Pumpkin. How can I help you grow your business today? 🎃",
            sender: "assistant",
            timestamp: Date.now()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);



    // Context changes handle
    useEffect(() => {
        if (pathname === "/" && !localStorage.getItem("visited_landing")) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                setMessages(prev => [...prev, {
                    id: crypto.randomUUID(),
                    text: "✨ **Welcome to Pumpkin!** ✨\n\nI'm so glad you're here. Are you a service professional looking to simplify your business? I can show you how we handle CRM, scheduling, and payments all in one place!\n\nWant to see our [Pricing](/pricing) or [Register](/register) for a free trial? 🎃",
                    sender: "assistant",
                    timestamp: Date.now()
                }]);
                localStorage.setItem("visited_landing", "true");
            }, 2500);
            return () => clearTimeout(timer);
        }

        if (pathname === "/login" && !messages.some(m => m.text.includes("Sign in here"))) {
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                text: "Need help getting back in? Sign in here to access your dashboard. If you've forgotten your password, just ask! 🔑",
                sender: "assistant",
                timestamp: Date.now()
            }]);
        }
    }, [pathname]);

    // New user welcome
    useEffect(() => {
        const isNewUser = localStorage.getItem("is_new_user");
        if (isNewUser === "true") {
            const timer = setTimeout(() => {
                setIsOpen(true);
                setMessages(prev => [...prev, {
                    id: crypto.randomUUID(),
                    text: "🎉 **Welcome to the Family!** 🎉\n\nI'm so excited to have you here at **Pumpkin**. I'm your AI companion and I'll be here to help you grow your business every step of the way!\n\nWant a quick tour or help setting up your first project? Just ask! 🎃✨",
                    sender: "assistant",
                    timestamp: Date.now()
                }]);
                localStorage.removeItem("is_new_user");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Scroll optimization
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const getRandomAnswer = (answers: string[]) => {
        return answers[Math.floor(Math.random() * answers.length)];
    };

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            text,
            sender: "user",
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            const query = text.toLowerCase();
            const match = KNOWLEDGE_BASE.find(k =>
                k.keywords.some(keyword => query.includes(keyword))
            );

            const assistantMsg: Message = {
                id: crypto.randomUUID(),
                text: match ? getRandomAnswer(match.answers) : getRandomAnswer(DEFAULT_ANSWERS),
                sender: "assistant",
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, assistantMsg]);
            setIsTyping(false);
        }, 800);
    };

    // HIDE ON DASHBOARD & PORTAL (Use UserAssistant instead)
    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/portal')) {
        return null;
    }

    return (
        <div ref={containerRef} className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        drag
                        dragMomentum={false}
                        initial={{ opacity: 0, scale: 0.8, y: 100, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8, y: 100, filter: "blur(10px)" }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="w-[350px] sm:w-[400px] h-[580px] bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col mb-4 cursor-default select-none"
                        style={{ touchAction: "none" }}
                    >
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-b from-emerald-500/20 to-transparent border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
                                    🎃
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
                                        Pumpkin AI
                                        <Sparkles className="w-3 h-3 text-emerald-400" />
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-none">Magic Assistant</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                                className="text-zinc-500 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide"
                        >
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} msg={msg} onLinkClick={(href) => router.push(href)} />
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 text-zinc-500 bg-white/5 p-4 rounded-3xl rounded-tl-none w-fit border border-white/5"
                                >
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Quick Tips */}
                        <div className="px-5 pb-3">
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
                                {[
                                    { icon: <Home className="w-3 h-3" />, label: "What is Pumpkin?", q: "What is Pumpkin?" },
                                    { icon: <CreditCard className="w-3 h-3" />, label: "Pricing?", q: "What are the pricing plans?" },
                                    { icon: <Zap className="w-3 h-3" />, label: "Inspiration", q: "Give me some inspiration" },
                                    { icon: <Coffee className="w-3 h-3" />, label: "Coffee break", q: "I need a coffee break" },
                                    { icon: <Sparkles className="w-3 h-3" />, label: "Tell me a joke", q: "Tell me a joke" }
                                ].map((tip) => (
                                    <button
                                        key={tip.label}
                                        type="button"
                                        onClick={() => handleSend(tip.q)}
                                        className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] text-zinc-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all font-bold uppercase tracking-widest flex items-center gap-2"
                                    >
                                        {tip.icon}
                                        {tip.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-black/40 backdrop-blur-md border-t border-white/5">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="relative group"
                            >
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask Pumpkin anything..."
                                    className="w-full bg-white/5 border border-white/10 rounded-[1.25rem] pl-5 pr-14 py-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                                />
                                <Button
                                    size="icon"
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 h-auto aspect-square bg-emerald-500 text-black hover:bg-emerald-400 rounded-xl transition-all disabled:opacity-30"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                            <div className="mt-3 text-center">
                                <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.2em]">Powered by Pumpkin Intelligence</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble - Optimized Animations */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex justify-end"
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-500 relative overflow-hidden group border-2",
                        isOpen ? "bg-zinc-950 border-white/20" : "bg-[#f97316] border-white/10"
                    )}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <span className="text-2xl sm:text-4xl filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300 select-none">
                            🎃
                        </span>

                        {/* Static Sparkles when closed to save performance, animated when hovered only */}
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="absolute top-2 right-2 w-3 h-3 text-white/50 animate-pulse" />
                            <Sparkles className="absolute bottom-2 left-2 w-2 h-2 text-white/30 animate-pulse" />
                        </div>
                    </div>
                </button>

                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border-2 border-zinc-950 flex items-center justify-center z-10"
                    >
                        <span className="text-[8px] sm:text-[10px] font-black text-black">!</span>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
