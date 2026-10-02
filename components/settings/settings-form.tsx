"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Organization } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Building2, CreditCard, Check, Coins } from "lucide-react";
import { SUPPORTED_CURRENCIES, getCurrency } from "@/lib/currency";
import { toast } from "sonner";

import { updateOrganizationAction } from "@/app/actions/organization";

interface SettingsFormProps {
  organization: Organization;
}

export function SettingsForm({ organization }: SettingsFormProps) {
  const router = useRouter();

  // Form state
  const [name, setName] = React.useState(organization.name);
  const [email, setEmail] = React.useState(organization.email);
  const [nif, setNif] = React.useState(organization.nif);
  const [rc, setRc] = React.useState(organization.rc);
  const [phone, setPhone] = React.useState(organization.phone);
  const [city, setCity] = React.useState(organization.city);
  const [country, setCountry] = React.useState(organization.country);

  const [currency, setCurrency] = React.useState(organization.currency || "BIF");
  const [defaultTaxRate, setDefaultTaxRate] = React.useState(
    organization.default_tax_rate ?? 15
  );
  const [invoicePrefix, setInvoicePrefix] = React.useState(
    organization.invoice_prefix || "RDSH"
  );
  const [paymentInstructions, setPaymentInstructions] = React.useState(
    organization.payment_instructions
  );

  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateOrganizationAction({
        name,
        email,
        nif,
        rc,
        phone,
        city,
        country,
        currency,
        default_tax_rate: defaultTaxRate,
        invoice_prefix: invoicePrefix,
        payment_instructions: paymentInstructions,
      });

      if (res.success) {
        const selectedCurrencyObj = getCurrency(currency);
        toast.success(
          `Paramètres enregistrés dans Supabase ! Devise active : ${selectedCurrencyObj.name}`
        );
        router.refresh();
      } else {
        toast.error(res.error || "Erreur d'enregistrement");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erreur réseau lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Identité Entreprise */}
      <Card className="border-slate-200/90 shadow-sm dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Identité légale
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
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Email professionnel *
              </label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                NIF (Numéro d'Identification Fiscale) *
              </label>
              <Input value={nif} onChange={(e) => setNif(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Registre de Commerce (RC) *
              </label>
              <Input value={rc} onChange={(e) => setRc(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Téléphone
              </label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Ville / Pays
              </label>
              <Input
                value={`${city}, ${country}`}
                onChange={(e) => {
                  const parts = e.target.value.split(",");
                  setCity(parts[0]?.trim() || city);
                  if (parts[1]) setCountry(parts[1]?.trim());
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres de facturation & Règlements */}
      <Card className="border-slate-200/90 shadow-sm dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Facturation & Règlements
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Devise principale, TVA par défaut et instructions bancaires/mobile money
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Devise Dropdown Selector matching user request */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-blue-600" />
                <span>Devise par défaut *</span>
              </label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 cursor-pointer shadow-xs"
                >
                  {SUPPORTED_CURRENCIES.map((cur) => (
                    <option key={cur.code} value={cur.code}>
                      {cur.flag} {cur.name} ({cur.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-400">
                Choix : Franc burundais, Dollar canadien, Dollar US, Euro.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Taux TVA par défaut (%)
              </label>
              <Input
                type="number"
                value={defaultTaxRate}
                onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Préfixe factures
              </label>
              <Input
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Instructions de paiement (Affichées sur le PDF)
            </label>
            <textarea
              rows={3}
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="h-11 px-6 rounded-xl font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Enregistrement..." : "Enregistrer les paramètres"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
