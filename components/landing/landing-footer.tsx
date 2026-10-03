import * as React from "react";
import Link from "next/link";
import { Receipt, Globe, MessageCircle } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-950 border-t border-white/10 py-16 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Footer Column Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center text-white font-bold text-base">
                <Receipt className="h-4 w-4" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                RDSH
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              La solution logicielle tout-en-un de facturation professionnelle multi-devises pour entrepreneurs, consultants, agences et PME en Afrique et à l&apos;international.
            </p>
            <div className="flex items-center gap-4 text-slate-400 text-base pt-1">
              <a
                aria-label="Site Web RDSH"
                className="hover:text-white transition-colors"
                href="#"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                aria-label="Support WhatsApp"
                className="hover:text-white transition-colors"
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Footer Col 1: Produit */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Produit
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a className="hover:text-white transition-colors" href="#fonctionnalites">
                  Créateur de factures
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#fonctionnalites">
                  Calculateur TVA & taxes
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#fonctionnalites">
                  Suivi des encaissements
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#tarifs">
                  Tarifs & Formules
                </a>
              </li>
            </ul>
          </div>

          {/* Footer Col 2: Ressources */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Ressources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Guide fiscal pratique
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Modèles de factures PDF
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Blog pour entrepreneurs
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Centre d&apos;aide & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Footer Col 3: Légal & Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Légal & Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Mentions légales
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Confidentialité
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Conditions d&apos;utilisation
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="mailto:support@rdsh.af">
                  support@rdsh.af
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © <span>{currentYear}</span> RDSH Technologies. Tous droits réservés.
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span>Fait avec fierté en Afrique</span> 🌍
          </div>
        </div>
      </div>
    </footer>
  );
}
