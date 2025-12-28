import { ShieldCheck, Lock, Globe } from "lucide-react";

export function Trust() {
    return (
        <section className="py-24 bg-[#051c1c]">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid md:grid-cols-3 gap-12">
                    <TrustItem
                        icon={<ShieldCheck className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]" />}
                        title="Safe Box"
                        description="Your client data is encrypted and guarded around the clock."
                    />
                    <TrustItem
                        icon={<Lock className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]" />}
                        title="Secure Vault"
                        description="Payments are processed through bank-grade secure channels."
                    />
                    <TrustItem
                        icon={<Globe className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]" />}
                        title="GDPR Party"
                        description="We respect your privacy and are fully compliant with global standards."
                    />
                </div>
            </div>
        </section>
    );
}

function TrustItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="mb-6">{icon}</div>
            <h3 className="text-lg font-bold font-heading text-white mb-2 uppercase tracking-widest">{title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">{description}</p>
        </div>
    )
}
