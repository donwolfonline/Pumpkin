import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full bg-[#051c1c]/40 backdrop-blur-xl border-b border-white/5">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] group-hover:scale-110 transition-transform">🎃</span>
                        <span className="text-2xl font-bold tracking-tight font-heading text-white">Pumpkin</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="#product" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Product</Link>
                        <Link href="#features" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Features</Link>
                        <Link href="#pricing" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Pricing</Link>
                        <Link href="#use-cases" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Use Cases</Link>
                        <Link href="#resources" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Resources</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors hidden sm:block">
                        Login
                    </Link>
                    <Button variant="ghost" className="hidden sm:flex font-semibold text-zinc-300 hover:text-white hover:bg-white/5">
                        Book a Demo
                    </Button>
                    <Button className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                        Get Started Free
                    </Button>
                </div>
            </div>
        </nav>
    );
}
