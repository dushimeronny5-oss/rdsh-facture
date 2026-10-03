import * as React from "react";

export function LandingStats() {
  return (
    <section className="py-12 bg-white text-dark-900 border-y border-slate-200" aria-label="Statistiques clés">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Stat Item 1 */}
          <div className="pt-4 md:pt-0 md:px-6">
            <div className="text-4xl sm:text-5xl font-extrabold text-accent-purple tracking-tight mb-2">
              15 000+
            </div>
            <div className="text-base font-semibold text-slate-900 mb-1">
              Factures émises en FCFA & BIF
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Par des prestataires, commerçants et PME africaines.
            </p>
          </div>

          {/* Stat Item 2 */}
          <div className="pt-6 md:pt-0 md:px-6">
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
              15% TVA
            </div>
            <div className="text-base font-semibold text-slate-900 mb-1">
              Conformité fiscale automatisée
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Zéro erreur de calcul et déclarations simplifiées.
            </p>
          </div>

          {/* Stat Item 3 */}
          <div className="pt-6 md:pt-0 md:px-6">
            <div className="text-4xl sm:text-5xl font-extrabold text-accent-violet tracking-tight mb-2">
              3x
            </div>
            <div className="text-base font-semibold text-slate-900 mb-1">
              Paiements reçus plus vite
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Grâce aux rappels instantanés et aux canaux Mobile Money.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
