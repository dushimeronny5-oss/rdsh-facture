import * as React from "react";
import { Star } from "lucide-react";

interface TestimonialItem {
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  quote: string;
}

const testimonials: TestimonialItem[] = [
  {
    name: "Amadou Diallo",
    role: "Fondateur, TechAgency • Dakar (Sénégal)",
    initials: "AD",
    avatarBg: "bg-purple-700",
    quote:
      "Avant RDSH, je passais mes dimanches à faire des factures sur Excel. Aujourd'hui, j'envoie mes factures en FCFA en 1 clic par WhatsApp et mes clients me payent deux fois plus vite.",
  },
  {
    name: "Fatou Bamba",
    role: "Directrice, Studio Créatif • Abidjan (RCI)",
    initials: "FB",
    avatarBg: "bg-pink-700",
    quote:
      "Le calcul automatique de la TVA à 15% m'a évité tellement de maux de tête comptables ! Mes factures ont enfin l'allure professionnelle que mérite mon agence.",
  },
  {
    name: "Jean-Paul Kamga",
    role: "Consultant Finance & Logistique • Douala",
    initials: "JK",
    avatarBg: "bg-emerald-700",
    quote:
      "Une plateforme pensée pour nos réalités africaines, avec les montants adaptés et le suivi rigoureux des encaissements. Indispensable pour tout entrepreneur sérieux.",
  },
];

export function LandingTestimonials() {
  return (
    <section
      className="py-24 bg-dark-850 relative"
      id="temoignages"
      aria-label="Témoignages clients"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-accent-glow font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20">
            Témoignages vérifiés
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white">
            La parole aux bâtisseurs du continent
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Découvrez comment RDSH transforme le quotidien administratif de nos entrepreneurs.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="glass-card glass-card-hover rounded-2xl p-7 border border-white/5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="text-amber-400 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${item.avatarBg} text-white font-bold flex items-center justify-center text-sm`}
                >
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
