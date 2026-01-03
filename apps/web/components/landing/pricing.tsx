import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Seedling",
        emoji: "🌱",
        price: "$0",
        description: "Perfect for starting out.",
        features: ["3 Projects", "Basic CRM", "Standard Invoices", "Email Support"],
        button: "Claim Reward",
        popular: false
    },
    {
        name: "Sprout",
        emoji: "🌿",
        price: "$12",
        priceSuffix: "/mo",
        description: "For the growing business founder.",
        features: ["10 Projects", "Advanced CRM", "Custom Branding", "Priority Support"],
        button: "Get Started",
        popular: false
    },
    {
        name: "Big Pumpkin",
        emoji: "🔥",
        price: "$29",
        priceSuffix: "/mo",
        description: "For scaling business.",
        features: ["Unlimited Projects", "Full Automation", "Team Access", "Dedicated Manager"],
        button: "Join the Party",
        popular: true
    },
    {
        name: "Pumpkin Patch",
        emoji: "🎃",
        price: "Custom",
        description: "For the big harvests.",
        features: ["Custom Contracts", "Infinite Storage", "White-labeling", "24/7 Phone Suport"],
        button: "Contact Sales",
        popular: false
    }
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-[#051c1c] relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-heading mb-4 glow-orange">
                        Get Your Rewards
                    </h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        Choose the plan that fits your growth. There&apos;s a seat at the table for everyone.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`inset-pod p-8 rounded-[3rem] border ${plan.popular ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20 scale-105 z-10' : 'border-white/5'} transition-all hover:translate-y-[-8px] flex flex-col relative`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)]">Most Popular</div>
                            )}

                            <div className="mb-6 text-5xl filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
                                {plan.emoji}
                            </div>

                            <h3 className="text-2xl font-bold font-heading mb-1 text-white italic">{plan.name}</h3>
                            <p className="text-zinc-500 text-xs font-medium mb-6 uppercase tracking-widest">{plan.description}</p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold font-heading text-white">{plan.price}</span>
                                {plan.priceSuffix && <span className="text-zinc-500 text-sm font-bold uppercase ml-1">{plan.priceSuffix}</span>}
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                        <Check className="h-4 w-4 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button asChild className={`w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                                <a href={`/register?plan=${plan.name.toLowerCase().replace(' ', '-')}`}>
                                    {plan.button}
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
