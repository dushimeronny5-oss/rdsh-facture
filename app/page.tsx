import type { Metadata } from "next";
import "./landing.css";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingStats } from "@/components/landing/landing-stats";
import { LandingProblems } from "@/components/landing/landing-problems";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingTestimonials } from "@/components/landing/landing-testimonials";
import { LandingPricing } from "@/components/landing/landing-pricing";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "RDSH — La plateforme de facturation conçue pour l'Afrique et l'international",
  description:
    "Créez des factures professionnelles en FCFA, BIF, USD, EUR et CAD en moins de 60 secondes. Calcul automatique de TVA, export PDF officiel, règlements Mobile Money et suivi de trésorerie.",
};

export default function LandingPage() {
  return (
    <div className="landing-root selection:bg-accent-violet selection:text-white">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingProblems />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingPricing />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
