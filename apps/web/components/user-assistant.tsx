"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ChevronRight, Home, CreditCard, HelpCircle, FileText, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
    id: string;
    text: string;
    sender: "assistant" | "user";
    timestamp: number;
}

// USER-FOCUSED KNOWLEDGE BASE (For Dashboard / Logged In Users)
// focuses on HOW TO USE the app, not SELLING the app.
const USER_KNOWLEDGE_BASE = [
    {
        keywords: ["project", "create", "new", "start"],
        answers: ["To start a new project, go to the **Projects** tab. Click **+ New Project** in the top right corner. You can then add tasks and assign them to team members! 🚀"]
    },
    {
        keywords: ["invoice", "bill", "payment", "money"],
        answers: ["You can manage billing in the **Payments** tab. Click **New Invoice** to create one. Once sent, you can track when clients view and pay it. 💰"]
    },
    {
        keywords: ["client", "contact", "crm", "customer"],
        answers: ["Your **CRM** holds all your contacts. You can import them or add them manually. Clicking a contact shows their full history, including emails and invoices! 👥"]
    },
    {
        keywords: ["contract", "sign", "legal"],
        answers: ["Need a contract? Go to **Documents**. You can use our templates or upload your own. We handle the e-signatures for you! ✍️"]
    },
    {
        keywords: ["setting", "profile", "account", "password"],
        answers: ["You can update your profile, company details, and branding in **Settings**. Just click the gear icon in the sidebar! ⚙️"]
    },
    {
        keywords: ["website", "domain", "edit site"],
        answers: ["Head to the **Website** tab to edit your public site. You can change themes, update text, and even hook up a custom domain on the Harvest plan! 🌐"]
    },
    {
        keywords: ["help", "support", "stuck"],
        answers: ["I'm here to help! Ask me how to create an invoice, manage clients, or set up your website. If you're really stuck, you can email support@pumpkin.app! 🎃"]
    },
    {
        keywords: ["joke", "funny"],
        answers: [
            "Why did the developer go broke? Because he used up all his cache! 💸",
            "What do you call a pumpkin that works in IT? A web developer! 🎃🕸️",
            "Why did the invoice cross the road? To get paid on the other side! 💰"
        ]
    }
];

const DEFAULT_ANSWERS = [
    "I'm your Dashboard Assistant! I can help you navigate projects, invoices, and your CRM. What do you need help with? 🎃",
    "I'm not sure about that one, but I can show you how to create an invoice or a new project! Just ask. ✨",
    "Hmm, I haven't learned that yet. Try asking about 'invoices', 'crm', or 'projects'! 🚀"
];

// Memoized Message Component
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

export function UserAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(() => [
        {
            id: 'init',
            text: "Hello! Need help managing your business today? I can help you with invoices, projects, or your CRM. 🎃",
            sender: "assistant",
            timestamp: Date.now()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll optimization
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

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
            const match = USER_KNOWLEDGE_BASE.find(k =>
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

    const handleToggle = () => {
        if (!isDragging) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <motion.div
            ref={containerRef}
            drag
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 100)} // Small delay to prevent click firing after drag
            className="fixed bottom-6 right-6 z-[100]"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        // Window no longer draggable independently, entire widget moves
                        initial={{ opacity: 0, scale: 0.8, y: 100, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8, y: 100, filter: "blur(10px)" }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="w-[350px] sm:w-[400px] h-[580px] bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col mb-4 cursor-default select-none"
                    >
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-b from-emerald-500/20 to-transparent border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
                                    🎃
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
                                        Pumpkin Support
                                        <Sparkles className="w-3 h-3 text-emerald-400" />
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-none">Online</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
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
                                    { icon: <FileText className="w-3 h-3" />, label: "Create Invoice", q: "How do I create an invoice?" },
                                    { icon: <Users className="w-3 h-3" />, label: "CRM Help", q: "How do I add a client?" },
                                    { icon: <CreditCard className="w-3 h-3" />, label: "Billing", q: "Where track payments?" },
                                    { icon: <HelpCircle className="w-3 h-3" />, label: "Support", q: "I need technical support" }
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
                                    placeholder="Type your question..."
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex justify-end"
            >
                <button
                    onClick={handleToggle}
                    className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-500 relative overflow-hidden group border-2",
                        isOpen ? "bg-zinc-950 border-white/20" : "bg-[#f97316] border-white/10"
                    )}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300 select-none">
                            🎃
                        </span>

                        {/* Static Sparkles when closed to save performance, animated when hovered only */}
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="absolute top-2 right-2 w-3 h-3 text-white/50 animate-pulse" />
                            <Sparkles className="absolute bottom-2 left-2 w-2 h-2 text-white/30 animate-pulse" />
                        </div>
                    </div>
                </button>
            </motion.div>
        </motion.div>
    );
}
