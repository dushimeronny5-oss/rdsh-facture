import { mockStore } from "@/lib/mock/store";
import { Invoice } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createClient } from "@/lib/supabase/server";

export async function getInvoices(): Promise<Invoice[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          client:clients(*),
          items:invoice_items(*)
        `)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as unknown as Invoice[];
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local store:", e);
    }
  }
  return mockStore.getInvoices();
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          client:clients(*),
          items:invoice_items(*)
        `)
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as unknown as Invoice;
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local store:", e);
    }
  }
  const inv = mockStore.getInvoiceById(id);
  return inv || null;
}

export async function saveInvoice(data: any): Promise<Invoice> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: inserted, error } = await supabase
        .from("invoices")
        .insert(data)
        .select()
        .single();

      if (!error && inserted) {
        return inserted as unknown as Invoice;
      }
    } catch (e) {
      console.warn("Supabase save failed, falling back to local store:", e);
    }
  }
  return mockStore.saveInvoice(data);
}

export async function updateInvoiceStatus(
  id: string,
  status: "sent" | "paid" | "cancelled"
): Promise<Invoice | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("invoices")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return data as unknown as Invoice;
      }
    } catch (e) {
      console.warn("Supabase status update failed, falling back to local store:", e);
    }
  }
  const inv = mockStore.markStatus(id, status);
  return inv || null;
}
