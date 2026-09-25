"use client";

import * as React from "react";
import { formatFBu, formatDate } from "@/lib/format";
import { Organization } from "@/lib/types";
import { Mail, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoicePreviewProps {
  organization: Organization;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
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
  notes?: string;
  paymentMethod?: string;
  onDownloadPdf?: () => void;
}

export function InvoicePdfPreview({
  organization,
  invoiceNumber,
  clientName,
  clientEmail,
  clientAddress,
  issueDate,
  dueDate,
  items,
  subtotal,
  taxRate,
  taxAmount,
  total,
  notes,
  paymentMethod = "Lumicash / Virement",
  onDownloadPdf,
}: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Preview Bar matching screenshot */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight dark:text-white">
          Preview
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs rounded-lg"
            onClick={handlePrint}
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs rounded-lg"
            onClick={onDownloadPdf}
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </Button>
        </div>
      </div>

      {/* Realistic Paper Invoice Card matching screenshot */}
      <div className="relative bg-white rounded-2xl p-8 border border-slate-200/90 shadow-invoice text-slate-900 overflow-hidden dark:bg-white dark:text-slate-900">
        {/* Header Row */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase font-mono">
              INVOICE
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1 font-mono">
              Invoice Number #{invoiceNumber || "FAC-2026-0001"}
            </p>
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
            <p className="font-bold text-slate-900 text-sm mt-0.5">
              {organization.name}
            </p>
            <p className="text-slate-500 mt-0.5">{organization.email}</p>
            <p className="text-slate-500">{organization.address}, {organization.city}</p>
            <p className="text-slate-500">NIF : {organization.nif} | RC : {organization.rc}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Billed to:
            </p>
            <p className="font-bold text-slate-900 text-sm mt-0.5">
              {clientName || "Sélectionnez un client"}
            </p>
            <p className="text-slate-500 mt-0.5">{clientEmail || "email@client.bi"}</p>
            <p className="text-slate-500">{clientAddress || "Bujumbura, Burundi"}</p>
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
                    {formatFBu(item.lineTotal ?? item.quantity * item.unitPrice)}
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
            <span className="font-medium text-slate-800">{formatFBu(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>TVA ({taxRate}%)</span>
            <span className="font-medium text-slate-800">{formatFBu(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-slate-200 font-bold text-slate-950">
            <span>Grand Total</span>
            <span className="text-base text-blue-600">{formatFBu(total)}</span>
          </div>
        </div>

        {/* Note Box */}
        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
          {notes || "Note: Late payments will incur a 10% annual fee, calculated daily according to commercial law."}
        </div>

        {/* Payment Method & Signature Row */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-end justify-between text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900">Payment Method</p>
            <p className="text-slate-500">{paymentMethod}</p>
            <p className="text-[11px] text-slate-400 font-mono">
              Lumicash : 79 123 456 | IBB : 10024-5892-01
            </p>
          </div>

          <div className="text-right">
            <div className="font-serif italic text-lg text-slate-800 tracking-wider">
              ~ RDSH Solutions ~
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase">
              Signature autorisée
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
