import * as React from "react";
import { getOrganization } from "@/lib/data/organization";
import { SettingsForm } from "@/components/settings/settings-form";

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

      <SettingsForm organization={organization} />
    </div>
  );
}
