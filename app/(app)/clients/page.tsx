import * as React from "react";
import Link from "next/link";
import { Plus, Users, Mail, Phone, MapPin, Building, FileText } from "lucide-react";
import { getClients } from "@/lib/data/clients";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { AddClientDialog } from "@/components/clients/add-client-dialog";

export const revalidate = 0;

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Clients
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 dark:text-slate-400">
            Répertoire des entreprises et particuliers facturés ({clients.length} clients).
          </p>
        </div>

        <AddClientDialog />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((client) => (
          <Card
            key={client.id}
            className="border-slate-200/90 shadow-xs hover:shadow-md transition-all dark:border-slate-800"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900">
                    {client.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {client.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">
                      NIF : {client.nif || "Non renseigné"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                {client.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {client.address}, {client.city}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Client actif</span>
                <Link href="/invoices/new">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Facturer
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
