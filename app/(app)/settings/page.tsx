import * as React from "react";
import { getOrganization } from "@/lib/data/organization";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Building2, CreditCard, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function SettingsPage() {
  const organization = await getOrganization();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Paramètres de l'entreprise
        </h1>
        <p className="text-sm text-slate-500 mt-0.5 dark:text-slate-400">
          Informations légales et coordonnées figurant sur vos factures officielles.
        </p>
      </div>

      <div className="space-y-6">
        {/* Identité Entreprise */}
        <Card className="border-slate-200/90 shadow-sm dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Identité légale (Burundi)
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Raison sociale, NIF et Registre du Commerce
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Nom de l'entreprise *
                </label>
                <Input defaultValue={organization.name} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Email professionnel *
                </label>
                <Input defaultValue={organization.email} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  NIF (Numéro d'Identification Fiscale) *
                </label>
                <Input defaultValue={organization.nif} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Registre de Commerce (RC) *
                </label>
                <Input defaultValue={organization.rc} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Téléphone
                </label>
                <Input defaultValue={organization.phone} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Ville / Pays
                </label>
                <Input defaultValue={`${organization.city}, ${organization.country}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de facturation */}
        <Card className="border-slate-200/90 shadow-sm dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Facturation & Règlements
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Devise, TVA par défaut et instructions bancaires/mobile money
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Devise
                </label>
                <Input defaultValue="FBu (BIF)" disabled />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Taux TVA par défaut (%)
                </label>
                <Input type="number" defaultValue={organization.default_tax_rate} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Préfixe factures
                </label>
                <Input defaultValue={organization.invoice_prefix} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Instructions de paiement (Affichées sur le PDF)
              </label>
              <textarea
                rows={3}
                defaultValue={organization.payment_instructions}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button className="h-11 px-6 rounded-xl font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="h-4 w-4" />
                <span>Enregistrer les paramètres</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
