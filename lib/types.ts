import { DisplayInvoiceStatus, StoredInvoiceStatus } from "./invoice/status";

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  nif: string;
  rc: string;
  logo_path?: string | null;
  default_tax_rate: number;
  default_payment_terms_days: number;
  invoice_prefix: string;
  next_invoice_number: number;
  payment_instructions: string;
  footer_note: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  org_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  nif: string;
  notes?: string;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  position: number;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Invoice {
  id: string;
  org_id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  client_address?: string;
  number: string;
  status: StoredInvoiceStatus;
  display_status?: DisplayInvoiceStatus;
  issue_date: string;
  due_date: string;
  currency?: string;
  tax_rate: number;
  subtotal: number;
  tax_amount: number;
  total: number;
  notes?: string;
  payment_method?: "especes" | "lumicash" | "ecocash" | "virement" | "cheque" | "autre";
  client_snapshot?: Record<string, unknown>;
  company_snapshot?: Record<string, unknown>;
  sent_at?: string | null;
  paid_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
}

export interface DashboardStats {
  totalBilled: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalCount: number;
  monthlyRevenue: Array<{
    month: string;
    billed: number;
    paid: number;
  }>;
  recentInvoices: Invoice[];
}
