import * as React from "react";
import { FileX2, Calculator, Hourglass } from "lucide-react";

export function LandingProblems() {
  return (
    <section className="py-24 bg-dark-900 relative" aria-label="Problèmes résolus">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-accent-glow font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20">
            Les douleurs du quotidien
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white">
            Pourquoi continuer à perdre des heures sur des outils inadaptés ?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Gérer sa facturation sur des tableurs génériques cause des fuites de trésorerie majeures aux entrepreneurs.
          </p>
        </div>

        {/* Friction Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Friction Card 1 */}
          <div className="glass-card glass-card-hover rounded-2xl p-7 border border-white/5 relative group">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-6">
              <FileX2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">
              Factures artisanales & non professionnelles
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fichiers Word déstructurés, alignements hasardeux et logos pixelisés font fuir les grands comptes et décrédibilisent votre savoir-faire.
            </p>
          </div>

          {/* Friction Card 2 */}
          <div className="glass-card glass-card-hover rounded-2xl p-7 border border-white/5 relative group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl mb-6">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">
              Calculs manuels de TVA & erreurs
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Risques permanents de redressement fiscal, temps perdu sur la calculatrice et incompréhensions avec vos comptables locaux.
            </p>
          </div>

          {/* Friction Card 3 */}
          <div className="glass-card glass-card-hover rounded-2xl p-7 border border-white/5 relative group">
            <div className="w-12 h-12 rounded-xl bg-accent-purple/20 text-accent-glow flex items-center justify-center text-xl mb-6">
              <Hourglass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">
              Suivi impossible & relances oubliées
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Les impayés s&apos;accumulent sans visibilité sur qui a payé et quand. Vous n&apos;osez plus relancer par peur de froisser vos clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
