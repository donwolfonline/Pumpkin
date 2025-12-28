import Link from "next/link";

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

                    <div>
                        <h4 className="font-bold mb-6 font-heading text-white uppercase tracking-widest text-sm">Game</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 font-heading text-white uppercase tracking-widest text-sm">Legal</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                            <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">© 2024 Pumpkin Party Inc. All rights reserved.</p>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Powered by Pumpkin Power</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
