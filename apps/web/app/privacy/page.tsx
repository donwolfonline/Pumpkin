import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#051c1c] font-sans text-foreground selection:bg-primary/20">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-8">Privacy Policy</h1>
                <div className="prose prose-invert prose-lg">
                    <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        At Pumpkin, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Information We Collect</h3>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h3>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.
                    </p>
                    {/* Add more placeholder content as needed */}
                </div>
            </main>
            <Footer />
        </div>
    );
}
