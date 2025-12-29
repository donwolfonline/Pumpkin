import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";
import { Palette, Code, Users, Briefcase, CheckCircle2 } from "lucide-react";

export default function UseCasesPage() {
    return (
        <div className="min-h-screen bg-[#051c1c] font-sans text-foreground selection:bg-primary/20">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Hero Header */}
                <header className="mx-auto max-w-7xl px-6 text-center mb-24">
                    <h1 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">Who we serve</h1>
                    <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight glow-orange">
                        Built for the <br />
                        <span className="text-zinc-600">Modern Solo Professional.</span>
                    </h2>
                    <p className="mt-8 text-xl text-zinc-400 max-w-2xl mx-auto">
                        Whether you&apos;re a single designer or a small nimble agency, Pumpkin is the operating system for your business growth.
                    </p>
                </header>

                <div className="mx-auto max-w-7xl px-6 space-y-32">
                    {useCases.map((useCase, index) => (
                        <section
                            key={index}
                            className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}
                        >
                            <div className="flex-1 space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                                    <useCase.icon className="h-4 w-4 text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{useCase.badge}</span>
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                                    {useCase.title} <br />
                                    <span className="text-zinc-600 italic">{useCase.subtitle}</span>
                                </h3>
                                <p className="text-zinc-400 text-lg leading-relaxed">
                                    {useCase.description}
                                </p>
                                <ul className="space-y-4">
                                    {useCase.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center gap-3 text-zinc-300 font-medium">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none" />
                                <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] bg-[#0a2c28] border border-white/5 flex items-center justify-center p-12 overflow-hidden group shadow-3xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                                    <div className="relative z-10 text-center scale-150 transform group-hover:scale-110 transition-transform duration-700">
                                        <useCase.icon className="h-24 w-24 text-primary opacity-20 absolute -top-12 -left-12 -rotate-12" />
                                        <useCase.icon className="h-48 w-48 text-primary filter drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]" />
                                    </div>
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 space-y-2">
                                            <div className="h-2 w-1/3 bg-primary/40 rounded-full" />
                                            <div className="h-2 w-full bg-white/10 rounded-full" />
                                            <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Final CTA */}
                <section className="mt-48 text-center mx-auto max-w-7xl px-6">
                    <div className="p-16 md:p-24 rounded-[4rem] bg-primary relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[#051c1c] transform scale-0 group-hover:scale-100 transition-transform duration-700 origin-center opacity-10 rounded-full" />
                        <h4 className="text-3xl md:text-6xl font-black text-primary-foreground uppercase tracking-tighter leading-none mb-8 relative z-10">
                            Ready to build <br />
                            <span className="text-white">your way?</span>
                        </h4>
                        <button className="h-16 px-10 rounded-full bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 relative z-10 shadow-2xl">
                            Start Free Trial
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

const useCases = [
    {
        icon: Palette,
        badge: "Creatives",
        title: "The Design",
        subtitle: "Maverick.",
        description: "Perfect for graphic designers, photographers, and visual artists who need their business documents to look as good as their portfolio.",
        features: [
            "Visually stunning, brandable invoices",
            "Signed contracts in minutes, not days",
            "High-fidelity project galleries for clients",
            "Automatic watermark & copyright protection"
        ]
    },
    {
        icon: Code,
        badge: "Developers",
        title: "The Tech",
        subtitle: "Architect.",
        description: "Built for software engineers and technical consultants who demand efficiency and clear milestone tracking.",
        features: [
            "Detailed technical proposal templates",
            "Milestone-based automated billing",
            "Version tracking for client agreements",
            "Integrated project health dashboard"
        ]
    },
    {
        icon: Users,
        badge: "Agencies",
        title: "The Agency",
        subtitle: "Powerhouse.",
        description: "Scale your nimble agency with tools designed for team collaboration and multi-client management.",
        features: [
            "Centralized team CRM for client data",
            "Multi-member project permissions",
            "Unified brand experience across projects",
            "Consolidated revenue & performance analytics"
        ]
    },
    {
        icon: Briefcase,
        badge: "Consultants",
        title: "The Strategic",
        subtitle: "Partner.",
        description: "For advisors and strategists where trust and professionalism are the primary currencies of the business.",
        features: [
            "Professional retainer management",
            "Time-tracking with intelligent rounding",
            "Secure document sharing portal",
            "White-label client experience"
        ]
    }
];
