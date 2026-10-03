import * as React from "react";
import {
  Sparkles,
  Percent,
  LineChart,
  Users,
  FileCheck,
  Check,
  Bell,
  MessageCircle,
} from "lucide-react";

export function LandingFeatures() {
  return (
    <section
      className="py-24 bg-dark-850 relative"
      id="fonctionnalites"
      aria-label="Fonctionnalités de la plateforme"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-accent-glow font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20">
            Solution universelle & sans frontières
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white">
            Une facturation sans frontières : encaissez dans toutes les devises sans prise de tête
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Que vous facturiez en Franc CFA (XOF/XAF), Franc Burundais (BIF), Dollars, Euros ou CAD, RDSH s&apos;adapte instantanément à votre monnaie et vos règles locales.
          </p>
        </div>

        {/* 4 Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="glass-card glass-card-hover rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-glow text-white flex items-center justify-center text-xl mb-6 shadow-md shadow-accent-purple/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Multi-devises universel (FCFA, BIF, $, €, CAD)
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Émettez des factures conformes en FCFA, Franc Burundais (BIF), USD, EUR ou CAD en 2 clics. Gestion automatique des devises, logos personnalisés et mentions fiscales locales et internationales.
              </p>
            </div>
            <div className="bg-dark-900/90 rounded-xl p-4 border border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-400" /> Export PDF HD & Multi-Monnaie
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Zéro friction
              </span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-card glass-card-hover rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-glow text-white flex items-center justify-center text-xl mb-6 shadow-md shadow-accent-purple/30">
                <Percent className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                TVA & taxes locales calculées automatiquement
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Calcul précis en temps réel du HT, de la TVA légale (15%, 18% ou sur mesure), des retenues à la source et adaptation selon la zone fiscale de vos clients sur le continent ou à l&apos;étranger.
              </p>
            </div>
            <div className="bg-dark-900/90 rounded-xl p-4 border border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>OHADA & International Ready</span>
              <span className="bg-accent-purple/30 text-accent-glow font-bold px-2 py-0.5 rounded">
                Conformité 100%
              </span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="glass-card glass-card-hover rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-glow text-white flex items-center justify-center text-xl mb-6 shadow-md shadow-accent-purple/30">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Suivi des paiements en temps réel
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Visualisez d&apos;un coup d&apos;œil vos factures payées, en attente ou en retard. Marquez les règlements Mobile Money (Wave, OM, Lumicash, Ecocash) et bancaires en un clic.
              </p>
            </div>
            <div className="bg-dark-900/90 rounded-xl p-4 border border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-400" /> Relances automatiques programmées
              </span>
              <span className="text-slate-400 font-mono">0 retard toléré</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="glass-card glass-card-hover rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-glow text-white flex items-center justify-center text-xl mb-6 shadow-md shadow-accent-purple/30">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Gestion de répertoire clients intégrée
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Conservez l&apos;historique complet de chaque client : devis acceptés, factures émises, soldes restants et coordonnées directes pour expédition express.
              </p>
            </div>
            <div className="bg-dark-900/90 rounded-xl p-4 border border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-400" /> Partage rapide WhatsApp & Email
              </span>
              <span className="text-slate-300 font-semibold">Gain : 4h / semaine</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
