import * as React from "react";

export function LandingHowItWorks() {
  return (
    <section
      className="py-24 bg-dark-900 relative"
      id="comment-ca-marche"
      aria-label="Comment ça marche"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-accent-glow font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20">
            Prise en main express
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white">
            Facturez en 3 étapes simples et rapides
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Aucune compétence technique nécessaire. Conçu pour aller droit au but.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative bg-dark-800/60 rounded-3xl p-8 border border-white/5 hover:border-accent-purple/40 transition-all text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-accent-purple/20 text-accent-glow flex items-center justify-center text-2xl font-bold font-editorial mb-6 border border-accent-purple/30">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Inscris-toi en 30 secondes
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Crée ton compte gratuit immédiatement. Aucune carte bancaire requise, aucun engagement.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-dark-800/60 rounded-3xl p-8 border border-accent-purple/30 shadow-lg shadow-accent-purple/10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-purple to-accent-glow text-white flex items-center justify-center text-2xl font-bold font-editorial mb-6 shadow-md shadow-accent-purple/40">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Génère ta première facture
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ajoute ton logo, sélectionne ton client, saisis le montant en FCFA ou BIF et laisse le système calculer la TVA.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-dark-800/60 rounded-3xl p-8 border border-white/5 hover:border-accent-purple/40 transition-all text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-accent-purple/20 text-accent-glow flex items-center justify-center text-2xl font-bold font-editorial mb-6 border border-accent-purple/30">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Envoie & Encaisse plus vite
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Partage le PDF directement par WhatsApp ou Email avec les consignes de règlement et reçois tes fonds sans délai.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
