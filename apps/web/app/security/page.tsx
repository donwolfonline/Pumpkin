import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-[#051c1c] font-sans text-foreground selection:bg-primary/20">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-8">Security</h1>
                <div className="prose prose-invert prose-lg">
                    <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
                    <p>
                        Security is our top priority at Pumpkin. We are committed to protecting your data and ensuring that our platform is secure.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Data Encryption</h3>
                    <p>
                        All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher. Data at rest is also encrypted using industry-standard encryption practices.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Access Controls</h3>
                    <p>
                        We implement strict access controls to ensure that only authorized personnel have access to your data.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
