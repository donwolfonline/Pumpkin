import { Button } from "@/components/ui/button";
import { Apple, Play } from "lucide-react";

export function Download() {
    return (
        <section className="py-24 bg-[#0a2c28] border-y border-white/5 relative overflow-hidden">
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-white glow-orange">
                        Ready to join the patch?
                    </h2>
                    <p className="text-xl text-zinc-400">
                        Download Pumpkin today and join over 150,000 business founders who have transformed their business with our atmospheric operating system.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        <Button className="h-16 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 flex items-center gap-4 transition-all hover:scale-105 shadow-xl">
                            <Apple className="h-8 w-8 fill-current" />
                            <div className="text-left">
                                <div className="text-[10px] font-bold uppercase tracking-widest leading-none">Download on the</div>
                                <div className="text-xl font-bold leading-none mt-1">App Store</div>
                            </div>
                        </Button>

                        <Button className="h-16 px-8 rounded-2xl bg-black text-white border border-white/10 hover:bg-zinc-900 flex items-center gap-4 transition-all hover:scale-105 shadow-xl">
                            <Play className="h-8 w-8 fill-current" />
                            <div className="text-left">
                                <div className="text-[10px] font-bold uppercase tracking-widest leading-none">Get it on</div>
                                <div className="text-xl font-bold leading-none mt-1">Google Play</div>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
