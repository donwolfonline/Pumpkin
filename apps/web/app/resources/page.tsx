import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";
import { BookOpen, FileText, Wrench, Lightbulb, ArrowRight, Download, ExternalLink, Zap } from "lucide-react";

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-[#051c1c] font-sans text-foreground selection:bg-primary/20">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Hero Header */}
                <header className="mx-auto max-w-7xl px-6 text-center mb-20">
                    <h1 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">knowledge Hub</h1>
                    <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight glow-orange">
                        Freelance Resources. <br />
                        <span className="text-zinc-600">Built for Growth.</span>
                    </h2>
                    <p className="mt-8 text-xl text-zinc-400 max-w-2xl mx-auto">
                        A curated collection of guides, templates, and tools to help you run your solo business with atmospheric clarity.
                    </p>
                </header>

                <div className="mx-auto max-w-7xl px-6">
                    {/* Featured Resource */}
                    <div className="relative group mb-32">
                        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full group-hover:bg-primary/30 transition-all duration-700 pointer-events-none" />
                        <div className="relative p-8 md:p-16 rounded-[4rem] bg-[#0a2c28]/40 border border-white/5 backdrop-blur-3xl overflow-hidden flex flex-col lg:flex-row items-center gap-12">
                            <div className="flex-1 space-y-6">
                                <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full">New Guide</span>
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">The Freelance <br /> Operating System</h3>
                                <p className="text-zinc-400 text-lg leading-relaxed">
                                    Our comprehensive 50-page guide on automating your entire business lifecycle, from discovery calls to multi-currency settlements.
                                </p>
                                <button className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                                    Read Featured Guide <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex-1 w-full lg:w-auto h-64 md:h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-[3rem] border border-white/5 flex items-center justify-center p-12">
                                <BookOpen className="h-32 w-32 text-primary filter drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]" />
                            </div>
                        </div>
                    </div>

                    {/* Resources Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resourceCategories.map((category, index) => (
                            <div key={index} className="flex flex-col h-full p-8 rounded-[3rem] bg-[#0a2c28] border border-white/5 hover:border-primary/20 transition-all group hover:-translate-y-2 duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                                    <category.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-4">{category.title}</h4>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                    {category.description}
                                </p>
                                <ul className="mt-auto space-y-4">
                                    {category.items.map((item, iIndex) => (
                                        <li key={iIndex} className="flex items-center justify-between group/item cursor-pointer">
                                            <span className="text-xs font-bold text-zinc-400 group-hover/item:text-white transition-colors">{item.label}</span>
                                            {item.type === 'download' ? (
                                                <Download className="h-3 w-3 text-zinc-600 group-hover/item:text-primary transition-colors" />
                                            ) : (
                                                <ExternalLink className="h-3 w-3 text-zinc-600 group-hover/item:text-primary transition-colors" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Community Section */}
                <section className="mt-48 mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                            <Lightbulb className="h-3 w-3 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Community Power</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                            Insights from <span className="text-zinc-600 italic">the Patch.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {insights.map((insight, index) => (
                            <div key={index} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all">
                                <p className="text-zinc-300 leading-relaxed mb-6 italic">&ldquo;{insight.text}&rdquo;</p>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-zinc-800" />
                                    <div>
                                        <p className="text-xs font-bold text-white">{insight.author}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{insight.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

const resourceCategories = [
    {
        icon: BookOpen,
        title: "Freelance Guides",
        description: "In-depth articles and playbooks for scaling your solo business operations.",
        items: [
            { label: "Financial Mastery for 1099s", type: "article" },
            { label: "Client Onboarding Secrets", type: "article" },
            { label: "Automated Tax Prep Guide", type: "article" },
            { label: "Global Payout Optimization", type: "article" }
        ]
    },
    {
        icon: FileText,
        title: "Document Templates",
        description: "Professional, battle-tested templates to jumpstart your client relationships.",
        items: [
            { label: "The Atmospheric Proposal", type: "download" },
            { label: "IP Protection Contract", type: "download" },
            { label: "Milestone Billing Sheet", type: "download" },
            { label: "Project Closure Summary", type: "download" }
        ]
    },
    {
        icon: Wrench,
        title: "Business Tools",
        description: "Free tools and checklists to keep your business running smoothly.",
        items: [
            { label: "Invoice ROI Calculator", type: "tool" },
            { label: "Tax Liability estimator", type: "tool" },
            { label: "Compliance Checklist", type: "tool" },
            { label: "Brand Identity Starter", type: "tool" }
        ]
    },
    {
        icon: Zap,
        title: "Efficiency Hacks",
        description: "Quick tips and automated workflows to reclaim your billable hours.",
        items: [
            { label: "Stripe Workflow Automation", type: "article" },
            { label: "CRM Cleanup Scripts", type: "article" },
            { label: "Contract Renewal Bot", type: "article" },
            { label: "No-Code Invoicing setup", type: "article" }
        ]
    }
];

const insights = [
    {
        text: "Pumpkin transformed how I handle visual proposals. My close rate jumped by 40% in two months.",
        author: "Sarah Chen",
        role: "Visual Designer"
    },
    {
        text: "The milestone billing logic is a lifesaver for dev projects. I never chase payments anymore.",
        author: "Marcus Thorne",
        role: "Full-Stack Developer"
    },
    {
        text: "Having my CRM and Invoicing in one atmospheric UI makes Monday mornings actually enjoyable.",
        author: "Elena Rodriguez",
        role: "Marketing Agency Founder"
    }
];
