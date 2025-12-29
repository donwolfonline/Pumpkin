import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";
import {
    Users,
    FileCheck2,
    Receipt,
    FileEdit,
    BarChart3,
    Zap,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Globe2,
    Clock
} from "lucide-react";

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-[#051c1c] font-sans text-foreground selection:bg-primary/20">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Hero Header */}
                <header className="mx-auto max-w-7xl px-6 text-center mb-32">
                    <h1 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">The Platform</h1>
                    <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-tight glow-orange">
                        Pure Clarity. <br />
                        <span className="text-zinc-600">Total Control.</span>
                    </h2>
                    <p className="mt-8 text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                        A unified operating system designed specifically for the modern solo professional. Forget the toolkit; own the workshop.
                    </p>
                </header>

                {/* Product Sections */}
                <div className="mx-auto max-w-7xl px-6 space-y-48">
                    {products.map((product, index) => (
                        <section
                            key={index}
                            className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32`}
                        >
                            <div className="flex-1 space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                                    <product.icon className="h-4 w-4 text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.badge}</span>
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                    {product.title} <br />
                                    <span className="text-zinc-600 italic">{product.subtitle}</span>
                                </h3>
                                <p className="text-zinc-400 text-lg leading-relaxed">
                                    {product.description}
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {product.features.map((feature, fIndex) => (
                                        <div key={fIndex} className="flex items-center gap-3 text-zinc-300 group/feature">
                                            <div className="h-2 w-2 rounded-full bg-primary/40 group-hover/feature:bg-primary transition-colors" />
                                            <span className="text-sm font-bold uppercase tracking-widest">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-8">
                                    <button className="group flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                                        Explored Detailed Capabilities <ArrowRight className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 w-full relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
                                <div className="relative rounded-[4rem] bg-[#0a2c28] border border-white/10 aspect-video lg:aspect-square flex items-center justify-center p-12 overflow-hidden shadow-3xl group">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                    {/* Mock UI Element */}
                                    <div className="relative z-10 w-full max-w-md aspect-[4/3] rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/5 shadow-2xl p-8 transform group-hover:scale-105 transition-transform duration-700">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="h-3 w-32 bg-white/10 rounded-full" />
                                            <div className="h-8 w-8 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center">
                                                <product.icon className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-2 w-full bg-white/5 rounded-full" />
                                            <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                                            <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                                        </div>
                                        <div className="mt-12 flex justify-end">
                                            <div className="h-10 w-24 rounded-xl bg-primary/10 border border-primary/20" />
                                        </div>
                                    </div>

                                    {/* Background Icon */}
                                    <product.icon className="absolute -bottom-12 -right-12 h-64 w-64 text-primary/5 -rotate-12 transition-transform duration-1000 group-hover:scale-110" />
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Trust & Compliance */}
                <section className="mt-64 border-t border-white/5 pt-32 mx-auto max-w-7xl px-6">
                    <div className="grid lg:grid-cols-3 gap-16">
                        <div className="space-y-6">
                            <ShieldCheck className="h-12 w-12 text-primary" />
                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Bank-Grade Security</h4>
                            <p className="text-zinc-500 leading-relaxed">
                                All data is encrypted with AES-256 and stored in compliant regional data centers of your choice.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <Globe2 className="h-12 w-12 text-primary" />
                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Global Compliance</h4>
                            <p className="text-zinc-500 leading-relaxed">
                                Fully GDPR and CCPA ready, with built-in tax compliance for 40+ countries.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <Clock className="h-12 w-12 text-primary" />
                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">99.9% Uptime SLA</h4>
                            <p className="text-zinc-500 leading-relaxed">
                                Our infrastructure is architected for zero-downtime deployments and maximum availability.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

const products = [
    {
        icon: Users,
        badge: "CRM",
        title: "Unified Client",
        subtitle: "Intelligence.",
        description: "Go beyond a simple contact list. Manage relationship health, communication history, and client value in one atmospheric interface.",
        features: [
            "Smart Contact Management",
            "Relationship Health Scores",
            "Communication Timelines",
            "Organization Hierarchies"
        ]
    },
    {
        icon: FileCheck2,
        badge: "Contracts",
        title: "Digital Agreement",
        subtitle: "Assurance.",
        description: "Generate, negotiate, and sign legally binding contracts. Real-time tracking of every signature and identity verification step.",
        features: [
            "Secure E-Signatures",
            "Contract Status Tracking",
            "Identity Verification",
            "Automated PDF Archiving"
        ]
    },
    {
        icon: Receipt,
        badge: "Invoicing",
        title: "Smart Revenue",
        subtitle: "Settlement.",
        description: "Professional billing that gets you paid faster. Automated tax calculation, multi-currency support, and instant payouts.",
        features: [
            "Automated Tax Engines",
            "Multi-Currency Billing",
            "One-Click Payouts",
            "Automated Reminders"
        ]
    },
    {
        icon: FileEdit,
        badge: "Proposals",
        title: "High-Impact",
        subtitle: "Discovery.",
        description: "Convert leads with stunning, interactive proposals. Track client engagement and transition discovery into signed agreements instantly.",
        features: [
            "Interactive Web Proposals",
            "Engagement Analytics",
            "Template Library",
            "Seamless Signature Flow"
        ]
    },
    {
        icon: BarChart3,
        badge: "Analytics",
        title: "Harvest Business",
        subtitle: "Insights.",
        description: "Deep-dive into your business performance. Track revenue, profitability, and project health with beautiful, actionable visualizations.",
        features: [
            "Revenue Forecasting",
            "Profitability tracking",
            "Operational Metrics",
            "Custom Reporting"
        ]
    },
    {
        icon: Zap,
        badge: "Automations",
        title: "Atmospheric",
        subtitle: "Workflows.",
        description: "The glue of your business. Trigger actions across modules based on project status, payments, or client interactions.",
        features: [
            "Custom Trigger Logic",
            "Multi-Module Sync",
            "API Integrations",
            "Webhooks & Alerts"
        ]
    }
];
