"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  MapPin,
  FileText,
  Check,
  TrendingUp,
  Zap,
} from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-mesh-radial">
      {/* Background Animated Glow Elements */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-accent-purple/20 rounded-full blur-[128px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-accent-glow/15 rounded-full blur-[128px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Badge Header */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-accent-purple/40 text-xs sm:text-sm font-semibold text-purple-200 shadow-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ✨ La solution de facturation n°1 en Afrique de l&apos;Ouest et Centrale
            </div>

            {/* Hero Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold text-white tracking-tight leading-[1.12]">
              Fini le casse-tête des factures sur{" "}
              <span className="text-gradient">Word et Excel.</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Créez des factures professionnelles en{" "}
              <strong className="text-white font-semibold">FCFA ou BIF</strong>{" "}
              conformes aux normes fiscales locales en moins de 60 secondes et encaissez plus vite.
            </p>

            {/* CTA Buttons Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/register"
                className="btn-cta-hero inline-flex items-center justify-center px-7 py-3.5 rounded-full text-base font-bold text-white bg-accent-purple hover:bg-accent-violet shadow-glow-purple"
              >
                <span>Commencer gratuitement</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#comment-ca-marche"
                className="btn-cta-secondary inline-flex items-center justify-center px-6 py-3.5 rounded-full text-base font-semibold text-slate-200"
              >
                <Play className="text-accent-glow mr-2 h-4 w-4 fill-accent-glow" />
                <span>Voir la démo</span>
              </a>
            </div>

            {/* Social Proof / Cities Tags */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-4">
                Adopté par plus de 3 500 PME et indépendants à :
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-400 font-semibold text-sm">
                <span className="hover:text-white transition-colors flex items-center gap-1.5">
                  <MapPin className="text-accent-purple h-3.5 w-3.5" /> Dakar
                </span>
                <span className="hover:text-white transition-colors flex items-center gap-1.5">
                  <MapPin className="text-accent-purple h-3.5 w-3.5" /> Abidjan
                </span>
                <span className="hover:text-white transition-colors flex items-center gap-1.5">
                  <MapPin className="text-accent-purple h-3.5 w-3.5" /> Douala
                </span>
                <span className="hover:text-white transition-colors flex items-center gap-1.5">
                  <MapPin className="text-accent-purple h-3.5 w-3.5" /> Yaoundé
                </span>
                <span className="hover:text-white transition-colors flex items-center gap-1.5">
                  <MapPin className="text-accent-purple h-3.5 w-3.5" /> Cotonou
                </span>
                <span className="hover:text-white transition-colors flex items-center gap-1.5">
                  <MapPin className="text-accent-purple h-3.5 w-3.5" /> Bujumbura
                </span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Dynamic SaaS Invoice Showcase Mockup */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Glow Behind Card */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-accent-purple to-pink-500 opacity-30 blur-2xl pointer-events-none" />

            {/* Floating Quick Badge */}
            <div className="absolute -top-4 -right-2 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-950/90 text-white border border-white/15 shadow-xl text-xs font-semibold animate-float-reverse">
              <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>Généré en 45s</span>
            </div>

            {/* Main Showcase Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-7 text-dark-900 border border-slate-100">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center font-bold text-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Facture #RDSH-2026-0089
                    </h3>
                    <p className="text-xs text-slate-500">
                      Client : Sté Nouvelle d&apos;Import-Export
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <Check className="h-3 w-3" /> Payée
                </span>
              </div>

              {/* Financial Breakdown Table Box */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Prestation de services & Conseil</span>
                  <span className="font-semibold text-slate-800">
                    1 200 000 FCFA
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>TVA 15% (Régime fiscal OHADA)</span>
                  <span className="font-semibold text-slate-800">
                    180 000 FCFA
                  </span>
                </div>
                <div className="border-t border-slate-200/80 pt-2 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Total TTC</span>
                  <span className="font-extrabold text-accent-purple text-base">
                    1 380 000 FCFA
                  </span>
                </div>
              </div>

              {/* Payment Channels Accepted */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                <span className="font-medium text-[11px]">Encaissé via :</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                    Wave
                  </span>
                  <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 font-bold text-[10px] border border-orange-200">
                    Orange Money
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                    Lumicash
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[10px] border border-red-200">
                    Ecocash
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-accent-purple font-bold text-[10px] border border-purple-200">
                    Virement IBB
                  </span>
                </div>
              </div>

              {/* Floating Mini Card: Monthly Inflow Analytics */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between bg-dark-950 text-white p-3.5 rounded-2xl shadow-xl animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Recouvrement ce mois
                    </div>
                    <div className="text-sm font-bold text-white">
                      9 840 000 FCFA
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  +28.4%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
