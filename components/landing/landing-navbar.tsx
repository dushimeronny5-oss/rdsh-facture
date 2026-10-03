"use client";

import * as React from "react";
import Link from "next/link";
import { Receipt, ArrowRight, Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl bg-dark-900/85 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-glow flex items-center justify-center shadow-lg shadow-accent-purple/30 group-hover:scale-105 transition-transform duration-300">
            <Receipt className="text-white h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              RDSH
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-glow border border-accent-purple/30">
                Afrique
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#fonctionnalites"
            className="hover:text-white transition-colors py-1"
          >
            Fonctionnalités
          </a>
          <a
            href="#comment-ca-marche"
            className="hover:text-white transition-colors py-1"
          >
            Comment ça marche
          </a>
          <a
            href="#tarifs"
            className="hover:text-white transition-colors py-1"
          >
            Tarifs
          </a>
          <a
            href="#temoignages"
            className="hover:text-white transition-colors py-1"
          >
            Témoignages
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="btn-cta-hero relative group inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-accent-purple hover:bg-accent-violet transition-all duration-300 shadow-lg shadow-accent-purple/25"
          >
            <span>Commencer gratuitement</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          aria-label="Menu de navigation"
          aria-expanded={mobileMenuOpen}
          className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          type="button"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-850 border-b border-white/10 px-6 py-6 space-y-4 mobile-menu-enter">
          <a
            href="#fonctionnalites"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white font-medium py-2 border-b border-white/5"
          >
            Fonctionnalités
          </a>
          <a
            href="#comment-ca-marche"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white font-medium py-2 border-b border-white/5"
          >
            Comment ça marche
          </a>
          <a
            href="#tarifs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white font-medium py-2 border-b border-white/5"
          >
            Tarifs
          </a>
          <a
            href="#temoignages"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white font-medium py-2 border-b border-white/5"
          >
            Témoignages
          </a>
          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-medium text-slate-300 hover:text-white py-2.5 rounded-xl border border-white/10"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-cta-hero text-center font-semibold text-white bg-accent-purple hover:bg-accent-violet py-3 rounded-full shadow-lg"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
