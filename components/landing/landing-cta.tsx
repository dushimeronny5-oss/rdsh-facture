import * as React from "react";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Headphones } from "lucide-react";

export function LandingCta() {
  return (
    <section
      className="py-20 relative overflow-hidden bg-dark-950"
      aria-label="Appel à l'action final"
    >
      {/* Purple Glow Orb */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-accent-purple/20 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="glass-card rounded-3xl p-10 sm:p-14 border border-white/10 bg-gradient-to-b from-dark-800/80 to-dark-900/90 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-white mb-4 tracking-tight">
            Rejoins les entrepreneurs qui facturent comme des pros
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Commence gratuitement dès aujourd&apos;hui. Aucune carte bancaire requise. Génère ta première facture en 60 secondes chrono.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="btn-cta-hero w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 rounded-full text-base font-bold text-white bg-accent-purple hover:bg-accent-violet transition-all shadow-glow-purple"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Trust Badges Under Button */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent-glow" /> Configuration en 2 minutes
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Conforme aux lois fiscales locales
            </span>
            <span className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-accent-glow" /> Support réactif 7j/7
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
