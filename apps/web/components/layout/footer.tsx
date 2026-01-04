import Link from "next/link";
import { VERSION } from "@/lib/version";

export function Footer() {
    return (
        <footer className="bg-[#051c1c] pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Small pumpkin peek-a-boo */}
            <div className="absolute -bottom-10 right-20 text-8xl opacity-10">🎃</div>

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-2 pr-8">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">🎃</span>
                            <span className="text-2xl font-bold tracking-tight font-heading text-white">Pumpkin</span>
                        </Link>
                        <p className="text-zinc-400 leading-relaxed max-w-sm mb-8">
                            All-in-one business management for modern service businesses.
                            Run your entire business from one calm dashboard.
                        </p>
                        <p className="font-heading italic text-primary font-bold uppercase tracking-widest text-xs">
                            Start Your Party Today
                        </p>
                    </div>

                    {/* Desktop: Normal columns */}
                    <div className="hidden md:block">
                        <h4 className="font-bold mb-6 font-heading text-white uppercase tracking-widest text-sm">Game</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div className="hidden md:block">
                        <h4 className="font-bold mb-6 font-heading text-white uppercase tracking-widest text-sm">Legal</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                            <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
                        </ul>
                    </div>

                    {/* Mobile: Single Pill with all links */}
                    <div className="md:hidden col-span-2">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold mb-4 font-heading text-white uppercase tracking-widest text-xs">Game</h4>
                                    <ul className="space-y-3 text-xs text-zinc-400">
                                        <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                                        <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                                        <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-4 font-heading text-white uppercase tracking-widest text-xs">Legal</h4>
                                    <ul className="space-y-3 text-xs text-zinc-400">
                                        <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                                        <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                                        <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest md:w-1/3">
                        © {new Date().getFullYear()} Pumpkin Party Inc.
                    </p>

                    <div className="md:w-1/3 flex justify-center">
                        <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em] bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            System v{VERSION}
                        </span>
                    </div>

                    <div className="md:w-1/3 flex items-center justify-center md:justify-end gap-6">
                        <Link href="/status" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">All Systems Normal</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
