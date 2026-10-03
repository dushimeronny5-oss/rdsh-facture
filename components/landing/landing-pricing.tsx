"use client";

import * as React from "react";
import Link from "next/link";
import { Check, X, CheckCircle2 } from "lucide-react";

type CurrencyKey = "FCFA" | "BIF" | "USD" | "CAD" | "EUR";

interface PriceConfig {
  label: string;
  unit: string;
  free: { monthly: string; annual: string };
  pro: { monthly: string; annual: string };
  business: { monthly: string; annual: string };
}

const currencyRates: Record<CurrencyKey, PriceConfig> = {
  FCFA: {
    label: "FCFA (XOF/XAF)",
    unit: "FCFA",
    free: { monthly: "0", annual: "0" },
    pro: { monthly: "15 000", annual: "12 000" },
    business: { monthly: "30 000", annual: "24 000" },
  },
  BIF: {
    label: "BIF (FBu)",
    unit: "FBu",
    free: { monthly: "0", annual: "0" },
    pro: { monthly: "70 000", annual: "56 000" },
    business: { monthly: "140 000", annual: "112 000" },
  },
  USD: {
    label: "USD ($)",
    unit: "$",
    free: { monthly: "0", annual: "0" },
    pro: { monthly: "25", annual: "20" },
    business: { monthly: "50", annual: "40" },
  },
  CAD: {
    label: "CAD ($ CA)",
    unit: "$ CA",
    free: { monthly: "0", annual: "0" },
    pro: { monthly: "35", annual: "28" },
    business: { monthly: "70", annual: "56" },
  },
  EUR: {
    label: "EUR (€)",
    unit: "€",
    free: { monthly: "0", annual: "0" },
    pro: { monthly: "25", annual: "20" },
    business: { monthly: "50", annual: "40" },
  },
};

export function LandingPricing() {
  const [currency, setCurrency] = React.useState<CurrencyKey>("FCFA");
  const [isAnnual, setIsAnnual] = React.useState(false);

  const activePricing = currencyRates[currency];

  const getPrice = (tier: "free" | "pro" | "business") => {
    return isAnnual ? activePricing[tier].annual : activePricing[tier].monthly;
  };

  return (
    <section
      className="py-24 bg-dark-900 relative"
      id="tarifs"
      aria-label="Tarifs et formules"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-accent-glow font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20">
            Tarification limpide
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white">
            Des formules adaptées à chaque taille d&apos;entreprise
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Tarification transparente et sans frais cachés. Paiement sécurisé par Carte Bancaire, Stripe & PayPal. Annulable à tout moment.
          </p>

          {/* Currency Switcher */}
          <div className="pt-4 flex items-center justify-center">
            <div
              className="inline-flex items-center p-1.5 rounded-full bg-dark-800 border border-white/10 gap-1 flex-wrap justify-center shadow-inner"
              role="radiogroup"
              aria-label="Sélectionner la devise"
            >
              {(Object.keys(currencyRates) as CurrencyKey[]).map((cKey) => {
                const isActive = currency === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setCurrency(cKey)}
                    className={`currency-btn px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-white bg-accent-purple shadow-sm shadow-accent-purple/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                    aria-checked={isActive}
                  >
                    {currencyRates[cKey].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Billing Period Toggle */}
          <div className="pt-6 flex items-center justify-center gap-4">
            <span
              className={`text-sm ${
                !isAnnual ? "font-semibold text-white" : "font-normal text-slate-400"
              }`}
            >
              Facturation mensuelle
            </span>
            <button
              aria-checked={isAnnual}
              aria-label="Basculer vers la facturation annuelle"
              role="switch"
              type="button"
              onClick={() => setIsAnnual((prev) => !prev)}
              className={`billing-toggle-btn relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-purple ${
                isAnnual ? "bg-accent-purple" : "bg-accent-purple/30"
              }`}
            >
              <div
                className={`billing-toggle-knob w-6 h-6 rounded-full shadow-md transform ${
                  isAnnual
                    ? "translate-x-6 bg-white"
                    : "translate-x-0 bg-accent-purple"
                }`}
              />
            </button>
            <span
              className={`text-sm flex items-center gap-1.5 ${
                isAnnual ? "font-semibold text-white" : "font-normal text-slate-400"
              }`}
            >
              Facturation annuelle
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                -20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch pt-4">
          {/* Plan 1: Gratuit */}
          <div className="glass-card glass-card-hover rounded-3xl p-8 border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Plan Gratuit</h3>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">
                    {getPrice("free")}
                  </span>
                  <span className="text-xl font-bold text-accent-glow ml-2">
                    {activePricing.unit}
                  </span>
                  <span className="text-slate-400 text-sm ml-1.5">/ mois</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-1">
                  Gratuit pour toujours
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>5 factures par mois</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>1 utilisateur unique</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Calcul automatique TVA 15%</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Export PDF officiel</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <X className="h-4 w-4 text-slate-600 shrink-0" />
                  <span>Relances WhatsApp automatisées</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full text-center py-3 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Plan 2: Pro (Featured) */}
          <div className="glass-card rounded-3xl p-8 border-2 border-accent-purple shadow-glow-purple flex flex-col justify-between relative bg-gradient-to-b from-dark-800 to-dark-850">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-purple to-accent-glow text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
              Le plus populaire ⭐
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Plan Pro</h3>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">
                    {getPrice("pro")}
                  </span>
                  <span className="text-xl font-bold text-accent-glow ml-2">
                    {activePricing.unit}
                  </span>
                  <span className="text-slate-300 text-sm ml-1.5">/ mois</span>
                </div>
                <div className="text-[11px] text-accent-glow font-medium mt-1">
                  {isAnnual ? "Facturé annuellement (-20%)" : "Sans engagement"}
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-200 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-accent-glow shrink-0" />
                  <strong className="text-white font-semibold">
                    Factures & devis illimités
                  </strong>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Relances automatiques WhatsApp & Email</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Tableau de bord financier complet</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Bons de commande & acomptes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Support client WhatsApp prioritaire 7j/7</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register?plan=pro"
              className="btn-cta-hero w-full text-center py-3.5 rounded-full text-sm font-bold text-white bg-accent-purple hover:bg-accent-violet shadow-lg shadow-accent-purple/30 transition-all hover:scale-[1.02]"
            >
              Choisir le Plan Pro
            </Link>
          </div>

          {/* Plan 3: Business */}
          <div className="glass-card glass-card-hover rounded-3xl p-8 border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Plan Business
              </h3>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">
                    {getPrice("business")}
                  </span>
                  <span className="text-xl font-bold text-slate-300 ml-2">
                    {activePricing.unit}
                  </span>
                  <span className="text-slate-400 text-sm ml-1.5">/ mois</span>
                </div>
                <div className="text-[11px] text-accent-glow font-medium mt-1">
                  {isAnnual ? "Facturé annuellement (-20%)" : "Sans engagement"}
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Jusqu&apos;à 10 collaborateurs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Gestion multi-entreprises</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Accès comptable dédié</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Exports comptables avancés (Sage, Syscoa)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent-glow shrink-0" />
                  <span>Accompagnement onboarding VIP</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register?plan=business"
              className="w-full text-center py-3 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
            >
              Choisir Business
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
