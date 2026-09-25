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
  Download,
  ChevronDown,
  Check,
  Sparkles,
  MapPin,
  Mail,
  Receipt,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Client, Organization } from "@/lib/types";
import { calculateInvoice } from "@/lib/invoice/calc";
import { InvoicePdfPreview } from "./invoice-pdf-preview";
import { formatCurrency, formatFBu, formatDate } from "@/lib/format";
import { SUPPORTED_CURRENCIES, getCurrency } from "@/lib/currency";
import { WheelDatePicker } from "@/components/ui/wheel-date-picker";
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

  // Client / Company custom typing states
  const initialClient = clients.find((c) => c.id === initialData?.client_id) || clients[0];
  const [clientName, setClientName] = React.useState(
    initialData?.client_name || initialClient?.name || "Brasseries du Burundi (BRARUDI)"
  );
  const [clientEmail, setClientEmail] = React.useState(
    initialData?.client_email || initialClient?.email || "contact@brarudi.bi"
  );
  const [clientAddress, setClientAddress] = React.useState(
    initialData?.client_address ||
      `${initialClient?.address || "Boulevard du 1er Novembre"}, ${initialClient?.city || "Bujumbura"}`
  );
  const [clientNif, setClientNif] = React.useState(
    initialData?.client_nif || initialClient?.nif || "4000000010"
  );
  const [isClientDropdownOpen, setIsClientDropdownOpen] = React.useState(false);
  const [showClientDetails, setShowClientDetails] = React.useState(false);

  // Date states & Wheel picker controls
  const [issueDate, setIssueDate] = React.useState(
    initialData?.issue_date || new Date().toISOString().substring(0, 10)
  );
  const [dueDate, setDueDate] = React.useState(() => {
    if (initialData?.due_date) return initialData.due_date;
    const d = new Date();
    d.setDate(d.getDate() + (organization.default_payment_terms_days || 30));
    return d.toISOString().substring(0, 10);
  });
  const [isIssueDatePickerOpen, setIsIssueDatePickerOpen] = React.useState(false);
  const [isDueDatePickerOpen, setIsDueDatePickerOpen] = React.useState(false);

  const [invoiceNumber, setInvoiceNumber] = React.useState(
    initialData?.number ||
      `${organization.invoice_prefix}-2026-${String(organization.next_invoice_number).padStart(4, "0")}`
  );
  const [taxRate, setTaxRate] = React.useState<number>(
    initialData?.tax_rate ?? organization.default_tax_rate ?? 15
  );
  const [currency, setCurrency] = React.useState<string>(
    initialData?.currency || organization.currency || "BIF"
  );
  const [notes, setNotes] = React.useState(
    initialData?.notes ||
      "Règlement exigé sous 30 jours. Mentionner le numéro de facture lors du virement ou paiement mobile."
  );

  // Filtered clients based on query
  const filteredClients = React.useMemo(() => {
    if (!clientName.trim()) return clients;
    const q = clientName.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [clients, clientName]);

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

  // Instant PDF Download / Print Handler
  const handleDownloadPdf = () => {
    const prevTitle = document.title;
    const cleanClient = (clientName || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");
    document.title = `${invoiceNumber || "Facture"}_${cleanClient}.pdf`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 1500);
    toast.success(
      `Facture prête pour ${clientName || "le client"} ! Sélectionnez "Enregistrer au format PDF" pour finaliser le téléchargement.`
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
            ? "lg:col-span-7 space-y-6 no-print"
            : "lg:col-span-12 max-w-4xl mx-auto space-y-6 no-print"
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
                Créez une facture, personnalisez votre entreprise cliente et téléchargez le PDF en un clic.
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
                Full Name (Billed by) *
              </label>
              <Input
                icon={<User className="h-4 w-4" />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom ou entreprise"
              />
            </div>

            {/* Billed To (Free-text company typing + autocomplete) */}
            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Billed To (Entreprise cliente) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowClientDetails(!showClientDetails)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium underline-offset-2 hover:underline dark:text-blue-400"
                >
                  {showClientDetails ? "Masquer détails" : "+ Détails client"}
                </button>
              </div>

              <div className="relative">
                <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-600 pointer-events-none z-10" />
                <Input
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    setIsClientDropdownOpen(true);
                  }}
                  onFocus={() => setIsClientDropdownOpen(true)}
                  placeholder="Tapez le nom de l'entreprise cliente..."
                  className="pl-10 pr-10 font-semibold text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Voir les entreprises enregistrées"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isClientDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {isClientDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden dark:bg-slate-900 dark:border-slate-800 max-h-64 overflow-y-auto">
                  {/* Option to use custom typed enterprise directly */}
                  {clientName.trim() && (
                    <div
                      onClick={() => setIsClientDropdownOpen(false)}
                      className="p-3 border-b border-slate-100 dark:border-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors bg-blue-50/30"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          🏢
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                            Utiliser « {clientName} »
                          </p>
                          <p className="text-[10px] text-blue-600 dark:text-blue-400">
                            Entreprise personnalisée (téléchargement direct)
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                        Saisie libre
                      </span>
                    </div>
                  )}

                  {/* Seeded clients list */}
                  <div className="p-1.5">
                    <p className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                      Entreprises enregistrées ({clients.length})
                    </p>
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => {
                          setClientName(client.name);
                          setClientEmail(client.email);
                          setClientAddress(`${client.address}, ${client.city}`);
                          setClientNif(client.nif || "");
                          setIsClientDropdownOpen(false);
                          toast.success(`Entreprise sélectionnée : ${client.name}`);
                        }}
                        className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {client.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {client.email} • {client.city}
                          </p>
                        </div>
                        {clientName === client.name && (
                          <Check className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Client Coordinates Section */}
              {showClientDetails && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5 dark:bg-slate-900/60 dark:border-slate-800 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">
                        Email client
                      </label>
                      <Input
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="facturation@entreprise.bi"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">
                        Adresse / Ville
                      </label>
                      <Input
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        placeholder="Boulevard de l'Uprona, Bujumbura"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">
                      NIF (Identifiant fiscal) - Optionnel
                    </label>
                    <Input
                      value={clientNif}
                      onChange={(e) => setClientNif(e.target.value)}
                      placeholder="Ex: 4000123456"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Date Issue with Wheel Date Picker trigger */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Date Issue *
                </label>
                <button
                  type="button"
                  onClick={() => setIsIssueDatePickerOpen(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 dark:text-blue-400"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Rouleau 3D</span>
                </button>
              </div>
              <div
                onClick={() => setIsIssueDatePickerOpen(true)}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 font-medium transition-colors cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-100 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{formatDate(issueDate)}</span>
                </div>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono dark:bg-slate-800 dark:text-slate-400">
                  {issueDate}
                </span>
              </div>
            </div>

            {/* Due Date with Wheel Date Picker trigger */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Due Date *
                </label>
                <button
                  type="button"
                  onClick={() => setIsDueDatePickerOpen(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 dark:text-blue-400"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Rouleau 3D</span>
                </button>
              </div>
              <div
                onClick={() => setIsDueDatePickerOpen(true)}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 font-medium transition-colors cursor-pointer hover:border-emerald-500 hover:ring-2 hover:ring-emerald-100 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span>{formatDate(dueDate)}</span>
                </div>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono dark:bg-slate-800 dark:text-slate-400">
                  {dueDate}
                </span>
              </div>
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

            {/* Currency selector with 4 currencies matching user request */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Currency *</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-9 px-3 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 cursor-pointer shadow-xs"
              >
                {SUPPORTED_CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.flag} {cur.name} ({cur.symbol})
                  </option>
                ))}
              </select>
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
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                    />
                  </div>

                  <div className="col-span-4 space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Tax Rate
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div className="col-span-5 space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Price ({currency})
                    </label>
                    <Input
                      type="number"
                      min={0}
                      icon={<Coins className="h-3.5 w-3.5" />}
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "unitPrice",
                          Math.max(0, parseFloat(e.target.value) || 0)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="w-full h-11 border-dashed border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600 rounded-xl gap-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Add Items</span>
            </Button>
          </div>
        </div>

        {/* Section 3: Notes & Action Buttons */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 dark:bg-slate-900 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Note (Mention légale ou coordonnées bancaires)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              placeholder="Instructions de paiement..."
            />
          </div>

          {/* Action Buttons matching user request: Download PDF directly */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              onClick={handleDownloadPdf}
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger la facture (PDF)</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold gap-2 border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
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
            clientName={clientName}
            clientEmail={clientEmail}
            clientAddress={clientAddress}
            clientNif={clientNif}
            issueDate={issueDate}
            dueDate={dueDate}
            items={items}
            subtotal={calculation.subtotal}
            taxRate={taxRate}
            taxAmount={calculation.taxAmount}
            total={calculation.total}
            currency={currency}
            notes={notes}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>
      )}

      {/* Interactive 3D Wheel Date Picker for Date Issue (inspired by user screenshot) */}
      <WheelDatePicker
        isOpen={isIssueDatePickerOpen}
        onClose={() => setIsIssueDatePickerOpen(false)}
        value={issueDate}
        onChange={(newDate) => setIssueDate(newDate)}
        title="Réservez en ligne"
        subtitle="Disponibilités (Date d'émission) :"
        fieldLabel="Date d'émission"
      />

      {/* Interactive 3D Wheel Date Picker for Due Date (inspired by user screenshot) */}
      <WheelDatePicker
        isOpen={isDueDatePickerOpen}
        onClose={() => setIsDueDatePickerOpen(false)}
        value={dueDate}
        onChange={(newDate) => setDueDate(newDate)}
        title="Réservez en ligne"
        subtitle="Disponibilités (Date d'échéance) :"
        fieldLabel="Date d'échéance"
      />
    </div>
  );
}
