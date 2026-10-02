"use client";

import * as React from "react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Organization } from "@/lib/types";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoicePreviewProps {
  organization: Organization;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientNif?: string;
  issueDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal?: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency?: string;
  notes?: string;
  paymentMethod?: string;
  onDownloadPdf?: () => void;
  onOrganizationNameChange?: (name: string) => void;
  onClientNameChange?: (name: string) => void;
  onInvoiceNumberChange?: (num: string) => void;
}

export function InvoicePdfPreview({
  organization,
  invoiceNumber,
  clientName,
  clientEmail,
  clientAddress,
  clientNif,
  issueDate,
  dueDate,
  items,
  subtotal,
  taxRate,
  taxAmount,
  total,
  currency = organization.currency || "BIF",
  notes,
  paymentMethod = "Lumicash / Virement",
  onDownloadPdf,
  onOrganizationNameChange,
  onClientNameChange,
  onInvoiceNumberChange,
}: InvoicePreviewProps) {
  // Avoid displaying personal gmail or account emails on invoices
  const displayEmail =
    organization.email &&
    !organization.email.toLowerCase().includes("dushime") &&
    !organization.email.toLowerCase().includes("@gmail.com")
      ? organization.email
      : null;

  const handlePrint = () => {
    const prevTitle = document.title;
    const cleanClient = (clientName || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");
    document.title = `${invoiceNumber || "Facture"}_${cleanClient}.pdf`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 1500);
  };

  const handleDownload = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      handlePrint();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Preview Bar matching screenshot */}
      <div className="flex items-center justify-between pb-4 no-print">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight dark:text-white">
          Preview
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs rounded-lg text-slate-700 hover:text-slate-900"
            onClick={handlePrint}
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimer
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-8 gap-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            onClick={handleDownload}
          >
            <Download className="h-3.5 w-3.5" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      {/* Realistic Paper Invoice Card matching screenshot */}
      <div 
        id="printable-invoice"
        className="relative bg-white rounded-2xl p-8 border border-slate-200/90 shadow-invoice text-slate-900 overflow-hidden dark:bg-white dark:text-slate-900"
      >
        {/* Header Row */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 uppercase font-mono">
              RDSH
            </h1>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-1 font-mono">
              <span>Invoice Number #</span>
              {onInvoiceNumberChange ? (
                <input
                  type="text"
                  value={invoiceNumber || "RDSH-2026-0001"}
                  onChange={(e) => onInvoiceNumberChange(e.target.value)}
                  className="bg-transparent hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1.5 py-0.5 border border-transparent hover:border-slate-200 focus:border-blue-400 outline-none font-mono font-bold text-slate-800 transition-all cursor-text print:p-0 print:border-none print:bg-transparent"
                  title="Cliquez pour modifier le numéro de facture"
                />
              ) : (
                <span className="font-bold text-slate-800">
                  {invoiceNumber || "RDSH-2026-0001"}
                </span>
              )}
            </div>
          </div>

          {/* Logo Emblem matching screenshot */}
          <div className="h-12 w-12 rounded-full bg-emerald-700 flex items-center justify-center text-white shadow-md">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 16H13V18H11V16ZM11 6H13V14H11V6Z"
                fill="currentColor"
                opacity="0.9"
              />
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
              <path
                d="M12 7V17M7 12H17"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 2-Columns Metadata */}
        <div className="grid grid-cols-2 gap-6 pt-6 text-xs">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Billed by:
            </p>
            {onOrganizationNameChange ? (
              <div className="relative group mt-0.5">
                <input
                  type="text"
                  value={organization.name || ""}
                  onChange={(e) => onOrganizationNameChange(e.target.value)}
                  placeholder="Votre nom ou entreprise"
                  className="font-bold text-slate-900 text-sm bg-transparent hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1.5 py-0.5 -ml-1.5 border border-transparent hover:border-slate-200 focus:border-blue-400 outline-none w-full transition-all cursor-text print:p-0 print:m-0 print:border-none print:bg-transparent print:font-bold"
                  title="Cliquez pour modifier le nom de l'entreprise directement sur la facture"
                />
              </div>
            ) : (
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {organization.name || "Nom de l'émetteur"}
              </p>
            )}
            {displayEmail && (
              <p className="text-slate-500 mt-0.5">{displayEmail}</p>
            )}
            {organization.phone && organization.phone.trim() !== "+257" && (
              <p className="text-slate-500">{organization.phone}</p>
            )}
            {organization.address && (
              <p className="text-slate-500">
                {organization.address}
                {organization.city ? `, ${organization.city}` : ""}
              </p>
            )}
            {(organization.nif || organization.rc) && (
              <p className="text-slate-500">
                {organization.nif ? `NIF : ${organization.nif}` : ""}
                {organization.nif && organization.rc ? " | " : ""}
                {organization.rc ? `RC : ${organization.rc}` : ""}
              </p>
            )}
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Billed to:
            </p>
            {onClientNameChange ? (
              <div className="relative group mt-0.5">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => onClientNameChange(e.target.value)}
                  placeholder="Nom du client"
                  className="font-bold text-slate-900 text-sm bg-transparent hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1.5 py-0.5 -ml-1.5 border border-transparent hover:border-slate-200 focus:border-blue-400 outline-none w-full transition-all cursor-text print:p-0 print:m-0 print:border-none print:bg-transparent print:font-bold"
                  title="Cliquez pour modifier le nom du client directement sur la facture"
                />
              </div>
            ) : (
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {clientName || "Nom du client"}
              </p>
            )}
            {clientEmail ? (
              <p className="text-slate-500 mt-0.5">{clientEmail}</p>
            ) : null}
            {clientAddress ? (
              <p className="text-slate-500">{clientAddress}</p>
            ) : null}
            {clientNif ? (
              <p className="text-slate-500">NIF : {clientNif}</p>
            ) : null}
          </div>
        </div>

        {/* Dates row */}
        <div className="grid grid-cols-2 gap-6 pt-4 pb-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Date Issue: </span>
            <span className="font-bold text-slate-800">{formatDate(issueDate)}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Due Date: </span>
            <span className="font-bold text-slate-800">{formatDate(dueDate)}</span>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="pt-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Invoice Items/Service:
          </p>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="pb-2 font-semibold">Item Name</th>
                <th className="pb-2 font-semibold text-center">QTY</th>
                <th className="pb-2 font-semibold text-center">Tax</th>
                <th className="pb-2 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr key={index} className="text-slate-800">
                  <td className="py-2.5 font-medium pr-2">
                    {item.description || "Nouvel article"}
                  </td>
                  <td className="py-2.5 text-center text-slate-600">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 text-center text-slate-600">
                    {taxRate}%
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    {formatCurrency(
                      item.lineTotal ?? item.quantity * item.unitPrice,
                      currency
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section matching screenshot */}
        <div className="pt-6 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-medium text-slate-800">
              {formatCurrency(subtotal, currency)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>TVA ({taxRate}%)</span>
            <span className="font-medium text-slate-800">
              {formatCurrency(taxAmount, currency)}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-slate-200 font-bold text-slate-950">
            <span>Grand Total</span>
            <span className="text-base text-blue-600">
              {formatCurrency(total, currency)}
            </span>
          </div>
        </div>

        {/* Note Box */}
        {notes ? (
          <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            {notes}
          </div>
        ) : null}

        {/* Footer Row */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="font-extrabold text-base tracking-wider text-slate-900 font-mono select-none">
              RDSH
            </span>
            <p className="text-[10px] text-slate-400 font-medium">
              Système de Facturation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
