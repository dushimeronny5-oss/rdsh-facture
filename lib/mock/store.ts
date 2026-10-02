import { Client, DashboardStats, Invoice, Organization } from "@/lib/types";
import { computeDisplayStatus } from "@/lib/invoice/status";
import { calculateInvoice } from "@/lib/invoice/calc";
import fs from "fs";
import path from "path";

export const initialOrganization: Organization = {
  id: "org_rdsh_001",
  name: "RDSH",
  email: "",
  phone: "+257 79 123 456",
  address: "Boulevard de l'Uprona, Immeuble Horizon 3ème étage",
  city: "Bujumbura",
  country: "Burundi",
  nif: "4001234567",
  rc: "BJM/2024/B/1892",
  logo_path: null,
  default_tax_rate: 15,
  default_payment_terms_days: 30,
  invoice_prefix: "RDSH",
  next_invoice_number: 1,
  payment_instructions:
    "Banque : Interbank Burundi (IBB)\nLumicash Marchand | Ecocash Marchand",
  footer_note: "SARL au capital de 10 000 000 FBu — Facture payable sous 30 jours.",
  currency: "BIF",
  created_at: "2026-01-01T08:00:00Z",
  updated_at: "2026-01-01T08:00:00Z",
};

export const initialClients: Client[] = [];

export const initialInvoices: Invoice[] = [];

class MockStore {
  private organization: Organization = { ...initialOrganization };
  private clients: Client[] = [...initialClients];
  private invoices: Invoice[] = [...initialInvoices];

  constructor() {
    this.loadCustomInvoices();
  }

  private getStorageFile(): string {
    return path.join(process.cwd(), "lib", "mock", ".custom_invoices.json");
  }

  private loadCustomInvoices() {
    try {
      const filePath = this.getStorageFile();
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(this.invoices.map((i) => i.id));
          const newItems = parsed.filter((i: Invoice) => !existingIds.has(i.id));
          this.invoices.unshift(...newItems);
        }
      }
    } catch (e) {
      console.warn("Failed to load custom invoices:", e);
    }
  }

  private persistCustomInvoices() {
    try {
      const filePath = this.getStorageFile();
      const initialIds = new Set(initialInvoices.map((i) => i.id));
      const custom = this.invoices.filter((i) => !initialIds.has(i.id));
      fs.writeFileSync(filePath, JSON.stringify(custom, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to persist custom invoice:", e);
    }
  }

  getOrganization(): Organization {
    return { ...this.organization };
  }

  updateOrganization(data: Partial<Organization>): Organization {
    this.organization = {
      ...this.organization,
      ...data,
      updated_at: new Date().toISOString(),
    };
    return { ...this.organization };
  }

  getClients(): Client[] {
    return this.clients
      .filter((c) => !c.archived_at)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getClientById(id: string): Client | undefined {
    return this.clients.find((c) => c.id === id);
  }

  saveClient(data: Partial<Client>): Client {
    if (data.id) {
      const idx = this.clients.findIndex((c) => c.id === data.id);
      if (idx >= 0) {
        this.clients[idx] = {
          ...this.clients[idx],
          ...data,
          updated_at: new Date().toISOString(),
        };
        return this.clients[idx];
      }
    }

    const newClient: Client = {
      id: `cli_${Date.now()}`,
      org_id: this.organization.id,
      name: data.name || "Nouveau client",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "Bujumbura",
      country: data.country || "Burundi",
      nif: data.nif || "",
      notes: data.notes || "",
      archived_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.clients.push(newClient);
    return newClient;
  }

  getInvoices(): Invoice[] {
    return this.invoices
      .map((inv) => ({
        ...inv,
        display_status: computeDisplayStatus(inv.status, inv.due_date),
      }))
      .sort((a, b) => {
        const dateCompare = b.issue_date.localeCompare(a.issue_date);
        if (dateCompare !== 0) return dateCompare;
        return (b.created_at || "").localeCompare(a.created_at || "");
      });
  }

  getInvoiceById(id: string): Invoice | undefined {
    const inv = this.invoices.find((i) => i.id === id);
    if (!inv) return undefined;
    return {
      ...inv,
      display_status: computeDisplayStatus(inv.status, inv.due_date),
    };
  }

  saveInvoice(data: any): Invoice {
    const calc = calculateInvoice(data.items || [], data.tax_rate ?? 15);
    const client = this.getClientById(data.client_id);

    if (data.id) {
      const idx = this.invoices.findIndex((i) => i.id === data.id);
      if (idx >= 0) {
        this.invoices[idx] = {
          ...this.invoices[idx],
          ...data,
          client_name: client?.name || data.client_name || this.invoices[idx].client_name,
          client_email: client?.email || data.client_email || this.invoices[idx].client_email,
          client_address: client?.address || data.client_address || this.invoices[idx].client_address,
          subtotal: calc.subtotal,
          tax_amount: calc.taxAmount,
          total: calc.total,
          updated_at: new Date().toISOString(),
        };
        this.persistCustomInvoices();
        return this.invoices[idx];
      }
    }

    const nextNum = this.organization.next_invoice_number;
    const formattedNum = `${this.organization.invoice_prefix}-2026-${String(nextNum).padStart(4, "0")}`;
    this.organization.next_invoice_number += 1;

    const newInvoice: Invoice = {
      id: data.id || `inv_${Date.now()}`,
      org_id: this.organization.id,
      client_id: data.client_id || `cli_custom_${Date.now()}`,
      client_name: client?.name || data.client_name || "Client",
      client_email: client?.email || data.client_email || "",
      client_address: client?.address || data.client_address || "",
      number: data.number || formattedNum,
      status: data.status || "draft",
      issue_date: data.issue_date || new Date().toISOString().substring(0, 10),
      due_date: data.due_date || new Date().toISOString().substring(0, 10),
      tax_rate: calc.taxRate,
      subtotal: calc.subtotal,
      tax_amount: calc.taxAmount,
      total: calc.total,
      notes: data.notes || "",
      payment_method: data.payment_method || "lumicash",
      items: (data.items || []).map((it: any, index: number) => {
        const qty = Number(it.quantity) || 1;
        const price = Number(it.unitPrice ?? it.unit_price) || 0;
        return {
          id: it.id || `item_${Date.now()}_${index}`,
          invoice_id: data.id || `inv_${Date.now()}`,
          position: index + 1,
          description: it.description || "",
          quantity: qty,
          unit_price: price,
          unitPrice: price,
          line_total: Math.round(qty * price),
          lineTotal: Math.round(qty * price),
        };
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (newInvoice.status === "sent") {
      newInvoice.sent_at = new Date().toISOString();
      newInvoice.company_snapshot = { ...this.organization };
      if (client) newInvoice.client_snapshot = { ...client };
    }

    this.invoices.unshift(newInvoice);
    this.persistCustomInvoices();
    return newInvoice;
  }

  markStatus(
    id: string,
    status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  ): Invoice | undefined {
    const inv = this.invoices.find((i) => i.id === id || i.number === id);
    if (!inv) return undefined;

    inv.updated_at = new Date().toISOString();

    if (status === "paid") {
      inv.status = "paid";
      inv.paid_at = new Date().toISOString();
    } else if (status === "sent") {
      inv.status = "sent";
      inv.sent_at = inv.sent_at || new Date().toISOString();
      const today = new Date().toISOString().substring(0, 10);
      if (inv.due_date < today) {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        inv.due_date = d.toISOString().substring(0, 10);
      }
    } else if (status === "overdue") {
      inv.status = "sent";
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      inv.due_date = yesterday.toISOString().substring(0, 10);
    } else if (status === "draft") {
      inv.status = "draft";
      inv.sent_at = null;
      inv.paid_at = null;
    } else if (status === "cancelled") {
      inv.status = "cancelled";
      inv.cancelled_at = new Date().toISOString();
    }

    inv.display_status = computeDisplayStatus(inv.status, inv.due_date);
    this.persistCustomInvoices();
    return inv;
  }

  getDashboardStats(): DashboardStats {
    const all = this.getInvoices();
    const nonCancelled = all.filter((i) => i.status !== "cancelled");

    // Definitions from specifications:
    // Montant facturé = somme des factures envoyées + payées (les brouillons ne comptent pas)
    // Montant payé = factures payées
    // Montant en attente = envoyées non payées (non échues)
    // Montant en retard = envoyées avec due_date < today
    let totalBilled = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;

    for (const inv of nonCancelled) {
      if (inv.status === "paid") {
        totalBilled += inv.total;
        totalPaid += inv.total;
      } else if (inv.status === "sent") {
        totalBilled += inv.total;
        if (inv.display_status === "overdue") {
          totalOverdue += inv.total;
        } else {
          totalPending += inv.total;
        }
      }
    }

    const monthlyRevenue = [
      { month: "Jan", billed: 1800000, paid: 1800000 },
      { month: "Fév", billed: 2200000, paid: 2200000 },
      { month: "Mar", billed: 3100000, paid: 2900000 },
      { month: "Avr", billed: 2750000, paid: 2750000 },
      { month: "Mai", billed: 3400000, paid: 3200000 },
      { month: "Juin", billed: 4100000, paid: 3800000 },
      { month: "Juil", billed: 5175000, paid: 5175000 },
      { month: "Août", billed: 3306825, paid: 2875000 },
      { month: "Sept", billed: 2357500, paid: 0 },
      { month: "Oct", billed: 0, paid: 0 },
      { month: "Nov", billed: 0, paid: 0 },
      { month: "Déc", billed: 0, paid: 0 },
    ];

    return {
      totalBilled,
      totalPaid,
      totalPending,
      totalOverdue,
      totalCount: nonCancelled.length,
      monthlyRevenue,
      recentInvoices: all.slice(0, 5),
    };
  }
}

// Global in-memory singleton for development
const globalForStore = global as unknown as { mockStore?: MockStore };
export const mockStore = globalForStore.mockStore || new MockStore();
if (process.env.NODE_ENV !== "production") globalForStore.mockStore = mockStore;
