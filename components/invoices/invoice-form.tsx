"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Building,
  Calendar,
  Hash,
  Coins,
  Puzzle,
  Layers,
  Percent,
  Plus,
  Trash2,
  Send,
  Save,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Client, Organization } from "@/lib/types";
import { calculateInvoice } from "@/lib/invoice/calc";
import { InvoicePdfPreview } from "./invoice-pdf-preview";
import { formatFBu } from "@/lib/format";
import { toast } from "sonner";

interface InvoiceFormProps {
  organization: Organization;
  clients: Client[];
  initialData?: any;
}

export function InvoiceForm({ organization, clients, initialData }: InvoiceFormProps) {
  const router = useRouter();
  const [showPreview, setShowPreview] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"standard" | "split" | "recurring">("standard");

  // Form states
  const [fullName, setFullName] = React.useState(organization.name);
  const [clientId, setClientId] = React.useState(
    initialData?.client_id || clients[0]?.id || ""
  );
  const [issueDate, setIssueDate] = React.useState(
    initialData?.issue_date || new Date().toISOString().substring(0, 10)
  );
  const [dueDate, setDueDate] = React.useState(() => {
    if (initialData?.due_date) return initialData.due_date;
    const d = new Date();
    d.setDate(d.getDate() + (organization.default_payment_terms_days || 30));
    return d.toISOString().substring(0, 10);
  });
  const [invoiceNumber, setInvoiceNumber] = React.useState(
    initialData?.number ||
      `${organization.invoice_prefix}-2026-${String(organization.next_invoice_number).padStart(4, "0")}`
  );
  const [taxRate, setTaxRate] = React.useState<number>(
    initialData?.tax_rate ?? organization.default_tax_rate ?? 15
  );
  const [notes, setNotes] = React.useState(
    initialData?.notes ||
      "Règlement exigé sous 30 jours. Mentionner le numéro de facture lors du virement ou paiement mobile."
  );

  // Line items state
  const [items, setItems] = React.useState<
    Array<{ id: string; description: string; quantity: number; unitPrice: number }>
  >(
    initialData?.items?.length
      ? initialData.items.map((it: any) => ({
          id: it.id || String(Math.random()),
          description: it.description || "",
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
        }))
      : [
          {
            id: "1",
            description: "Prestation de services & développement",
            quantity: 2,
            unitPrice: 150000,
          },
          {
            id: "2",
            description: "Support technique & maintenance",
            quantity: 1,
            unitPrice: 75500,
          },
        ]
  );

  // Client selected object
  const selectedClient = clients.find((c) => c.id === clientId) || clients[0];

  // Dynamic calculations in real time using pure calc
  const calculation = calculateInvoice(items, taxRate);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        description: "",
        quantity: 1,
        unitPrice: 50000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error("La facture doit contenir au moins un article.");
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: "description" | "quantity" | "unitPrice",
    value: any
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const handleSaveDraft = async () => {
    toast.success("Brouillon de facture enregistré avec succès !");
    router.push("/invoices");
  };

  const handleSendInvoice = async () => {
    toast.success(`Facture ${invoiceNumber} émise et marquée comme envoyée !`);
    router.push("/invoices");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form Section */}
      <div
        className={
          showPreview
            ? "lg:col-span-7 space-y-6"
            : "lg:col-span-12 max-w-4xl mx-auto space-y-6"
        }
      >
        {/* Breadcrumb & Header matching screenshot */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <span>Invoice</span>
            <span>&gt;</span>
            <span className="text-slate-700 dark:text-slate-200">Create Invoice</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create Invoice
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Create a new invoice and deliver it instantly.
              </p>
            </div>

            {/* Show Preview Switch matching screenshot */}
            <div className="flex items-center gap-2.5 bg-slate-100/80 px-3 py-1.5 rounded-full dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Show Preview
              </span>
              <Switch
                checked={showPreview}
                onCheckedChange={(checked) => setShowPreview(checked)}
              />
            </div>
          </div>
        </div>

        {/* Tab Selector matching screenshot: Standard | Split | Recurring */}
        <div className="flex p-1 bg-slate-100 rounded-xl max-w-md border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800">
          {(["standard", "split", "recurring"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              {tab === "standard"
                ? "Standard"
                : tab === "split"
                ? "Échelonnée (Split)"
                : "Récurrente"}
            </button>
          ))}
        </div>

        {/* Section 1: Invoice Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Invoice Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Full Name *
              </label>
              <Input
                icon={<User className="h-4 w-4" />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom ou entreprise"
              />
            </div>

            {/* Billed To (Client Selector) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Billed To *
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-600 pointer-events-none" />
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Issue */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Date Issue *
              </label>
              <Input
                type="date"
                icon={<Calendar className="h-4 w-4" />}
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Due Date *
              </label>
              <Input
                type="date"
                icon={<Calendar className="h-4 w-4" />}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Invoice Number */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Invoice Number
              </label>
              <Input
                icon={<Hash className="h-4 w-4" />}
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Ex. FAC-2026-0001"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Invoice Items/Service */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Invoice Items/Service
            </h2>

            {/* Currency selector matching screenshot */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Currency *</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                <span>🇧🇮</span>
                <span>FBu (Franc burundais)</span>
              </div>
            </div>
          </div>

          {/* Dynamic Item Cards */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Item {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Item Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Item Name
                  </label>
                  <Input
                    icon={<Puzzle className="h-4 w-4" />}
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(item.id, "description", e.target.value)
                    }
                    placeholder="Ex. Conception logo & identité de marque"
                  />
                </div>

                {/* QTY, Tax, Amount */}
                <div className="grid grid-cols-12 gap-3 pt-1">
                  <div className="col-span-3 space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      QTY
                    </label>
                    <Input
                      type="number"
                      min={1}
                      icon={<Layers className="h-3.5 w-3.5" />}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          Math.max(1, Number(e.target.value) || 1)
                        )
                      }
                    />
                  </div>

                  <div className="col-span-4 space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Tax (TVA)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                      <select
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-2 text-xs font-semibold text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                      >
                        <option value={15}>15% (Standard)</option>
                        <option value={0}>0% (Exonéré)</option>
                        <option value={10}>10%</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-5 space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Prix Unitaire (FBu)
                    </label>
                    <Input
                      type="number"
                      step={500}
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "unitPrice",
                          Math.max(0, Number(e.target.value) || 0)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1 px-1 text-slate-500">
                  <span>Montant de la ligne :</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatFBu(item.quantity * item.unitPrice)}
                  </span>
                </div>
              </div>
            ))}

            {/* + Add Items button matching screenshot */}
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
            >
              <Plus className="h-4 w-4" />
              <span>Add Items</span>
            </button>
          </div>
        </div>

        {/* Section 3: Notes & Actions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Conditions de règlement & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
              placeholder="Instructions complémentaires..."
            />
          </div>

          {/* Action Buttons matching screenshot */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold gap-2 border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <Save className="h-4 w-4" />
              <span>Save as Draft</span>
            </Button>

            <Button
              type="button"
              onClick={handleSendInvoice}
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
            >
              <Send className="h-4 w-4" />
              <span>Send Invoice</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Live Preview Section matching screenshot */}
      {showPreview && (
        <div className="lg:col-span-5 sticky top-6">
          <InvoicePdfPreview
            organization={organization}
            invoiceNumber={invoiceNumber}
            clientName={selectedClient?.name || "Client"}
            clientEmail={selectedClient?.email}
            clientAddress={`${selectedClient?.address || ""}, ${selectedClient?.city || ""}`}
            issueDate={issueDate}
            dueDate={dueDate}
            items={items}
            subtotal={calculation.subtotal}
            taxRate={taxRate}
            taxAmount={calculation.taxAmount}
            total={calculation.total}
            notes={notes}
            onDownloadPdf={() => toast.success("Génération du document PDF en cours...")}
          />
        </div>
      )}
    </div>
  );
}
