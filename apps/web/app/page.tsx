import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Solution } from "@/components/landing/solution";
import { AIShowcase } from "@/components/landing/ai-showcase";
import { ClientPortal } from "@/components/landing/client-portal";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PumpkinLineup } from "@/components/landing/pumpkin-lineup";
import { MobileShowcase } from "@/components/landing/mobile-showcase";
import { UseCases } from "@/components/landing/use-cases";
import { Brand } from "@/components/landing/brand";
import { Trust } from "@/components/landing/trust";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Download } from "@/components/landing/download";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#051c1c] font-sans text-foreground selection:bg-primary/20">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <AIShowcase />
        <ClientPortal />
        <HowItWorks />
        <PumpkinLineup />
        <MobileShowcase />
        <UseCases />
        <Brand />
        <Trust />
        <Testimonials />
        <Pricing />
        <Download />
      </main>
      <Footer />
    </div>
  );
}
