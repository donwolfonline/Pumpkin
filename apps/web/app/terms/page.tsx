import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#051c1c] font-sans text-foreground selection:bg-primary/20">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-8">Terms of Service</h1>
                <div className="prose prose-invert prose-lg">
                    <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        Welcome to Pumpkin. By accessing or using our website and services, you agree to be bound by these Terms of Service.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Use License</h3>
                    <p>
                        Permission is granted to temporarily download one copy of the materials (information or software) on Pumpkin&apos;s website for personal, non-commercial transitory viewing only.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
