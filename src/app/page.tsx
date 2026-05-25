import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { HowItWorks } from '@/components/landing/how-it-works';
import { CtaSection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Hero />
      <Features />
      <HowItWorks />
      <CtaSection />
      <Footer />
    </div>
  );
}
