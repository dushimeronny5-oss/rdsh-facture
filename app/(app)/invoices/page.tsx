import * as React from "react";
import Link from "next/link";
import { Plus, Search, Filter, Download, Eye, CheckCircle2 } from "lucide-react";
import { getInvoices } from "@/lib/data/invoices";
import { StatusBadge } from "@/components/invoices/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatFBu, formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function InvoicesListPage({
  searchParams,
}: {
  searchParams?: { status?: string; search?: string };
}) {
  const allInvoices = await getInvoices();
  const activeFilter = searchParams?.status || "all";

  const filteredInvoices = allInvoices.filter((inv) => {
    if (activeFilter === "all") return true;
    const currentStatus = inv.display_status || inv.status;
    return currentStatus === activeFilter;
  });

  const filterTabs = [
    { label: "Toutes", value: "all", count: allInvoices.length },
    {
      label: "Brouillons",
      value: "draft",
      count: allInvoices.filter((i) => i.status === "draft").length,
    },
    {
      label: "Envoyées",
      value: "sent",
      count: allInvoices.filter((i) => i.display_status === "sent").length,
    },
    {
      label: "En retard",
      value: "overdue",
      count: allInvoices.filter((i) => i.display_status === "overdue").length,
    },
    {
      label: "Payées",
      value: "paid",
      count: allInvoices.filter((i) => i.status === "paid").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Factures
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 dark:text-slate-400">
            Gestion du cycle de vie de vos factures et suivi des paiements.
          </p>
        </div>

        <Link href="/invoices/new">
          <Button className="h-11 px-5 rounded-xl font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
            <Plus className="h-4 w-4" />
            <span>Créer une facture</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
        {filterTabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/invoices" : `/invoices?status=${tab.value}`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeFilter === tab.value
                ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeFilter === tab.value
                  ? "bg-white/20 text-white dark:bg-slate-800 dark:text-slate-200"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Invoices List Table */}
      <Card className="border-slate-200/90 shadow-sm dark:border-slate-800 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold dark:bg-slate-900/80 dark:border-slate-800">
                  <th className="py-3.5 px-4">Numéro</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Date d'émission</th>
                  <th className="py-3.5 px-4">Échéance</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Montant</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-900/60"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {inv.number}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {inv.client_name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {inv.client_email}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(inv.issue_date)}
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(inv.due_date)}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge
                        status={inv.display_status || inv.status}
                        invoiceId={inv.id}
                        invoiceNumber={inv.number}
                        interactive
                      />
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900 text-sm dark:text-slate-100">
                      {formatFBu(inv.total)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href="/invoices/new">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs rounded-lg"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Voir
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
