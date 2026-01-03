import {
    Users,
    FileText,
    CreditCard,
    Calendar
} from "lucide-react";

export function Features() {
    return (
        <section id="features" className="py-24 bg-[#0a2c28] border-y border-white/5 relative overflow-hidden">
            {/* Background Vines */}
            <div className="absolute top-0 left-0 w-full h-[300px] pointer-events-none opacity-20">
                <svg className="w-full h-full" viewBox="0 0 1440 300" preserveAspectRatio="none">
                    <path d="M0 100 Q 360 250 720 100 T 1440 100" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                </svg>
            </div>

            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-heading mb-4">
                        How to Grow Your Business
                    </h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        Follow the pumpkin trail to success.
                    </p>
                </div>

                {/* Inset Pods - Steps Style */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="group relative flex flex-col items-center">
                            {/* Number Indicator */}
                            <div className="mb-4 text-primary font-bold font-heading text-lg opacity-50">
                                {i + 1}
                            </div>

                            {/* The Inset Pod */}
                            <div className="inset-pod w-full p-6 rounded-[2rem] text-center min-h-[240px] flex flex-col items-center justify-between group-hover:scale-105 transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.1)]">
                                <div className="mb-4 relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-6xl select-none filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] block transform group-hover:rotate-12 transition-transform">
                                        {feature.mascot}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold font-heading mb-2 text-primary">{feature.title}</h3>
                                    <p className="text-xs text-zinc-400 leading-relaxed px-2">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const features = [
    {
        title: "AI-Augmented CRM",
        mascot: "✨",
        description: "Track leads and manage clients with proactive AI insights and automation.",
        icon: <Users className="w-6 h-6" />
    },
    {
        title: "Legal Vault",
        mascot: "⚖️",
        description: "Verified contract templates with secure e-signatures and paperless logic.",
        icon: <FileText className="w-6 h-6" />
    },
    {
        title: "Core Finance",
        mascot: "📊",
        description: "Full accounting suite with Chart of Accounts, General Ledger, and automated expense tracking.",
        icon: <CreditCard className="w-6 h-6" />
    },
    {
        title: "Smart Scheduler",
        mascot: "📅",
        description: "Sync your calendar and let AI handle the booking back-and-forth.",
        icon: <Calendar className="w-6 h-6" />
    },
]
