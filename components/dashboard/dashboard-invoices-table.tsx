"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
} from "lucide-react";
import { Invoice } from "@/lib/types";
import { StatusBadge } from "@/components/invoices/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatFBu, formatDate } from "@/lib/format";

interface DashboardInvoicesTableProps {
  invoices: Invoice[];
}

export function DashboardInvoicesTable({ invoices }: DashboardInvoicesTableProps) {
  const [invoiceList, setInvoiceList] = React.useState<Invoice[]>(invoices);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);

  // Sync when prop updates
  React.useEffect(() => {
    setInvoiceList(invoices);
  }, [invoices]);

  const handleStatusChange = (invoiceId: string, newStatus: any) => {
    setInvoiceList((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId || inv.number === invoiceId
          ? {
              ...inv,
              status: newStatus === "overdue" ? "sent" : newStatus,
              display_status: newStatus,
            }
          : inv
      )
    );
  };

  // Filter invoices based on status and search query
  const filteredInvoices = React.useMemo(() => {
    return invoiceList.filter((inv) => {
      const currentStatus = inv.display_status || inv.status;

      if (statusFilter !== "all" && currentStatus !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = inv.number.toLowerCase().includes(query);
        const matchesClient = (inv.client_name || "").toLowerCase().includes(query);
        const matchesEmail = (inv.client_email || "").toLowerCase().includes(query);
        return matchesNumber || matchesClient || matchesEmail;
      }

      return true;
    });
  }, [invoiceList, statusFilter, searchQuery]);

  // Total pages based on itemsPerPage (default 10 items/page -> exactly 3 pages for 30 invoices)
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));

  // If current page is out of bounds after filtering or page size change, reset to page 1
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Sliced items for the current page
  const paginatedInvoices = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvoices, currentPage, itemsPerPage]);

  const startIndex = filteredInvoices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredInvoices.length);

  const filterTabs = [
    { label: "Toutes", value: "all", count: invoiceList.length },
    {
      label: "Payées",
      value: "paid",
      count: invoiceList.filter((i) => i.status === "paid").length,
    },
    {
      label: "En attente",
      value: "sent",
      count: invoiceList.filter((i) => i.display_status === "sent").length,
    },
    {
      label: "En retard",
      value: "overdue",
      count: invoiceList.filter((i) => i.display_status === "overdue").length,
    },
    {
      label: "Brouillons",
      value: "draft",
      count: invoiceList.filter((i) => i.status === "draft").length,
    },
  ];

  return (
    <Card className="border-slate-200/90 shadow-sm dark:border-slate-800">
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Toutes les factures
              </CardTitle>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold dark:bg-blue-950/60 dark:text-blue-300">
                {invoices.length} factures au total
              </span>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Consultez les {invoices.length} factures enregistrées, réparties sur {totalPages} {totalPages > 1 ? "pages" : "page"} avec filtres et recherche instantanée
            </CardDescription>
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer client, N°..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 pl-8 pr-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
              />
            </div>

            <Link href="/invoices/new">
              <Button
                size="sm"
                className="h-9 px-3 text-xs rounded-xl font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nouvelle facture</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === tab.value
                  ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900"
                  : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.value
                    ? "bg-white/20 text-white dark:bg-slate-800 dark:text-slate-200"
                    : "bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-3 px-4 pl-6">Numéro</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Émission</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Montant</th>
                <th className="py-3 px-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    Aucune facture trouvée correspondant à ces critères.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-900/60"
                  >
                    <td className="py-3 px-4 pl-6 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {inv.number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {inv.client_name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {inv.client_email}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(inv.issue_date)}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(inv.due_date)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={inv.display_status || inv.status}
                        invoiceId={inv.id}
                        invoiceNumber={inv.number}
                        interactive
                        onStatusChange={(newStatus) =>
                          handleStatusChange(inv.id, newStatus)
                        }
                      />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatFBu(inv.total)}
                    </td>
                    <td className="py-3 px-4 text-right pr-6">
                      <Link href="/invoices/new">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Voir
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 3-Page Pagination Controls strictly complying with the user request */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-4">
            {filteredInvoices.length > 0 ? (
              <span>
                Affichage de <span className="font-bold text-slate-800 dark:text-slate-200">{startIndex}</span> à{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">{endIndex}</span> sur{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">{filteredInvoices.length}</span> factures (Page {currentPage} sur {totalPages})
              </span>
            ) : (
              <span>0 facture</span>
            )}

            {/* Optional page size selector */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">Lignes :</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 px-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
              >
                <option value={10}>10 par page (3 pages)</option>
                <option value={15}>15 par page (2 pages)</option>
                <option value={30}>30 par page (1 page)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Précédent */}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 text-xs rounded-lg gap-1 border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Précédent</span>
            </Button>

            {/* Page number buttons: 1, 2, 3 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Suivant */}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5 text-xs rounded-lg gap-1 border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
            >
              <span>Suivant</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
