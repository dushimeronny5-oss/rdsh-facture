import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Plus,
} from "lucide-react";
import { getDashboardStats } from "@/lib/data/dashboard";
import { getOrganization } from "@/lib/data/organization";
import { getInvoices } from "@/lib/data/invoices";
import { getClients } from "@/lib/data/clients";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { DashboardInvoicesTable } from "@/components/dashboard/dashboard-invoices-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatFBu } from "@/lib/format";

export const revalidate = 0;

export default async function DashboardPage() {
  const [stats, organization, allInvoices, clients] = await Promise.all([
    getDashboardStats(),
    getOrganization(),
    getInvoices(),
    getClients(),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bonjour, {organization.name} 👋
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
              BIF (FBu)
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            Suivi en direct de votre trésorerie, vos créances et vos factures clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/invoices/new">
            <Button className="h-11 px-5 rounded-xl font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
              <Plus className="h-4 w-4" />
              <span>Créer une facture</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Key Stat Cards matching fintech aesthetics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total encaissé"
          value={formatFBu(stats.totalPaid)}
          description="Règlements encaissés"
          icon={CheckCircle2}
          accentColor="emerald"
          trend={{ value: "+24.0% vs N-1", positive: true }}
        />

        <StatCard
          title="Facture en attente"
          value={formatFBu(stats.totalPending)}
          description="Factures envoyées en cours"
          icon={Clock}
          accentColor="blue"
        />

        <StatCard
          title="En retard"
          value={formatFBu(stats.totalOverdue)}
          description="Échéance dépassée"
          icon={AlertTriangle}
          accentColor="amber"
          trend={{ value: "À relancer", positive: false }}
        />

        <StatCard
          title="Total client"
          value={String(clients.length)}
          description="Clients enregistrés"
          icon={Users}
          accentColor="indigo"
        />
      </div>

      {/* Middle Section: Chart + Payment Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recharts Revenue Curve */}
        <div className="lg:col-span-8">
          <RevenueChart data={stats.monthlyRevenue} />
        </div>

        {/* Right: Trésorerie & Moyens de paiement africains */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-slate-200/90 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Règlements acceptés
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Canaux configurés pour vos clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between dark:bg-slate-900/60 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                    LM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Lumicash Marchand
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Actif
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between dark:bg-slate-900/60 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                    IBB
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Virement Interbank (IBB)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Actif
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between dark:bg-slate-900/60 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-xs">
                    EC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Ecocash Marchand
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Actif
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Paginated Invoices Table (Max 3 pages) */}
      <DashboardInvoicesTable invoices={allInvoices} />
    </div>
  );
}
