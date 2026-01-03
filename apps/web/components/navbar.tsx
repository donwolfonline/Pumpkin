"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContactForm } from "@/components/landing/contact-form";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isDemoOpen, setIsDemoOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { label: "Product", href: "/product" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "Use Cases", href: "/use-cases" },
        { label: "Resources", href: "/resources" },
        { label: "Login", href: "/login" },
    ];

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobileMenuOpen) {
                const target = event.target as HTMLElement;
                // Check if click is outside menu items
                if (!target.closest('.menu-circle') && !target.closest('button[aria-label="menu"]')) {
                    setIsMobileMenuOpen(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {
            scale: 0,
            opacity: 0,
            rotate: -180,
            y: -20
        },
        visible: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 260,
                damping: 20,
            }
        }
    };

    return (
        <>
            <nav className="fixed top-6 left-0 right-0 z-50 px-4 md:px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Single Large Pill Container */}
                    <div className="flex items-center justify-between h-16 px-6 rounded-full bg-[#051c1c]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group shrink-0">
                            <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] group-hover:scale-110 transition-transform">🎃</span>
                            <span className="text-xl font-bold tracking-tight font-heading text-white">Pumpkin</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center px-8">
                            <Link href="/product" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all">Product</Link>
                            <Link href="#how-it-works" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all">How It Works</Link>
                            <Link href="#pricing" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all">Pricing</Link>
                            <Link href="/use-cases" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all">Use Cases</Link>
                            <Link href="/resources" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all">Resources</Link>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            <Link href="/login" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                                Login
                            </Link>

                            <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
                                <DialogTrigger asChild>
                                    <button suppressHydrationWarning className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all">
                                        Book a Demo
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-[#051c1c] border-white/10 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="font-heading uppercase tracking-widest text-xl">Book a Demo</DialogTitle>
                                        <DialogDescription className="text-zinc-400">
                                            Fill out the form below and our team will get back to you within 24 hours to schedule a walkthrough.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ContactForm onSuccess={() => setIsDemoOpen(false)} />
                                </DialogContent>
                            </Dialog>

                            <Link href="/register">
                                <Button className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-all h-auto">
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                            }}
                            aria-label="menu"
                            className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-all text-white"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile Menu Circles */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                className="lg:hidden mt-4 grid grid-cols-2 gap-3 px-4 place-items-center menu-circle"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                style={{ zIndex: 50 }}
                            >
                                {menuItems.map((item) => (
                                    <motion.div
                                        key={item.href}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="menu-circle"
                                    >
                                        <Link
                                            href={item.href}
                                            className="block px-4 py-2 rounded-full bg-[#051c1c]/90 backdrop-blur-xl border border-white/10 shadow-xl text-xs font-semibold text-white hover:bg-white/10 transition-colors text-center"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Book a Demo Circle */}
                                <motion.div variants={itemVariants} className="menu-circle">
                                    <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
                                        <DialogTrigger asChild>
                                            <motion.button
                                                suppressHydrationWarning
                                                className="px-4 py-2 rounded-full bg-[#051c1c]/90 backdrop-blur-xl border border-white/10 shadow-xl text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Book a Demo
                                            </motion.button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] bg-[#051c1c] border-white/10 text-white">
                                            <DialogHeader>
                                                <DialogTitle className="font-heading uppercase tracking-widest text-xl">Book a Demo</DialogTitle>
                                                <DialogDescription className="text-zinc-400">
                                                    Fill out the form below and our team will get back to you within 24 hours to schedule a walkthrough.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <ContactForm onSuccess={() => setIsDemoOpen(false)} />
                                        </DialogContent>
                                    </Dialog>
                                </motion.div>

                                {/* Get Started Free Circle */}
                                <motion.div variants={itemVariants} className="menu-circle">
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 text-xs rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-colors">
                                                Get Started Free
                                            </Button>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* Backdrop overlay for mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ zIndex: 40 }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
