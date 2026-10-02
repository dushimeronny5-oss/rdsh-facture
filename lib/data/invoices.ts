import { mockStore } from "@/lib/mock/store";
import { Invoice } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createClient } from "@/lib/supabase/server";
import { computeDisplayStatus } from "@/lib/invoice/status";
import { getOrganization } from "@/lib/data/organization";

export async function getInvoices(): Promise<Invoice[]> {
  const localInvoices = mockStore.getInvoices();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const org = await getOrganization();

      let query = supabase
        .from("invoices")
        .select(`
          *,
          client:clients(*),
          items:invoice_items(*)
        `)
        .order("created_at", { ascending: false });

      if (org?.id) {
        query = query.eq("organization_id", org.id);
      }

      const { data, error } = await query;

      if (!error && data) {
        return (data as unknown as any[]).map((inv) => {
          const displayStatus = computeDisplayStatus(inv.status, inv.due_date);
          const rawItems = inv.items || [];
          // Sort items by sort_order
          const sortedItems = [...rawItems].sort(
            (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
          );

          return {
            id: inv.id,
            org_id: inv.organization_id,
            client_id: inv.client_id || "",
            client_name: inv.client?.name || inv.client_name || "Client",
            client_email: inv.client?.email || "",
            client_address: inv.client?.address || "",
            number: inv.number,
            status: inv.status,
            display_status: displayStatus,
            issue_date: inv.issue_date,
            due_date: inv.due_date,
            currency: inv.currency || "BIF",
            tax_rate: Number(inv.tax_rate) || 15,
            subtotal: Number(inv.subtotal) || 0,
            tax_amount: Number(inv.tax_amount) || 0,
            total: Number(inv.total) || 0,
            notes: inv.notes || "",
            payment_method: inv.payment_method || "lumicash",
            created_at: inv.created_at,
            updated_at: inv.updated_at,
            items: sortedItems.map((it: any, idx: number) => ({
              id: it.id,
              invoice_id: it.invoice_id,
              position: it.sort_order || idx + 1,
              description: it.description,
              quantity: Number(it.quantity) || 1,
              unit_price: Number(it.unit_price) || 0,
              line_total: Number(it.line_total) || 0,
            })),
          };
        });
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local store:", e);
    }
  }

  return localInvoices;
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
        .or(`id.eq.${id},number.eq.${id}`)
        .maybeSingle();

      if (!error && data) {
        const inv = data as any;
        const displayStatus = computeDisplayStatus(inv.status, inv.due_date);
        const sortedItems = [...(inv.items || [])].sort(
          (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
        );

        return {
          id: inv.id,
          org_id: inv.organization_id,
          client_id: inv.client_id || "",
          client_name: inv.client?.name || inv.client_name || "Client",
          client_email: inv.client?.email || "",
          client_address: inv.client?.address || "",
          number: inv.number,
          status: inv.status,
          display_status: displayStatus,
          issue_date: inv.issue_date,
          due_date: inv.due_date,
          currency: inv.currency || "BIF",
          tax_rate: Number(inv.tax_rate) || 15,
          subtotal: Number(inv.subtotal) || 0,
          tax_amount: Number(inv.tax_amount) || 0,
          total: Number(inv.total) || 0,
          notes: inv.notes || "",
          payment_method: inv.payment_method || "lumicash",
          created_at: inv.created_at,
          updated_at: inv.updated_at,
          items: sortedItems.map((it: any, idx: number) => ({
            id: it.id,
            invoice_id: it.invoice_id,
            position: it.sort_order || idx + 1,
            description: it.description,
            quantity: Number(it.quantity) || 1,
            unit_price: Number(it.unit_price) || 0,
            line_total: Number(it.line_total) || 0,
          })),
        };
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local store:", e);
    }
  }

  const localInv = mockStore.getInvoiceById(id);
  return localInv || null;
}

export async function saveInvoice(data: any): Promise<Invoice> {
  const localSaved = mockStore.saveInvoice(data);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const org = await getOrganization();
      const orgId = org.id || "00000000-0000-0000-0000-000000000001";

      // 1. Resolve client in Supabase
      let supabaseClientId: string | null = null;
      if (data.client_id && data.client_id.includes("-")) {
        supabaseClientId = data.client_id;
      } else if (data.client_name) {
        const { data: existingClient } = await supabase
          .from("clients")
          .select("id")
          .ilike("name", data.client_name.trim())
          .limit(1)
          .maybeSingle();

        if (existingClient) {
          supabaseClientId = existingClient.id;
        } else {
          const { data: newClient } = await supabase
            .from("clients")
            .insert({
              organization_id: orgId,
              name: data.client_name,
              email: data.client_email || null,
              address: data.client_address || null,
              nif: data.client_nif || null,
              city: "Bujumbura",
              country: "Burundi",
            })
            .select("id")
            .single();

          if (newClient) {
            supabaseClientId = newClient.id;
          }
        }
      }

      // 2. Insert Invoice
      const { data: inserted, error: invError } = await supabase
        .from("invoices")
        .insert({
          organization_id: orgId,
          client_id: supabaseClientId,
          number: localSaved.number,
          status: localSaved.status,
          issue_date: localSaved.issue_date,
          due_date: localSaved.due_date,
          currency: localSaved.currency || "BIF",
          tax_rate: localSaved.tax_rate,
          subtotal: localSaved.subtotal,
          tax_amount: localSaved.tax_amount,
          total: localSaved.total,
          notes: localSaved.notes || null,
          payment_method: localSaved.payment_method || "lumicash",
        })
        .select()
        .single();

      if (!invError && inserted) {
        // 3. Insert Invoice Items
        if (localSaved.items?.length) {
          await supabase.from("invoice_items").insert(
            localSaved.items.map((it: any, idx: number) => ({
              invoice_id: inserted.id,
              description: it.description,
              quantity: it.quantity,
              unit_price: it.unit_price ?? it.unitPrice ?? 0,
              line_total: it.line_total ?? it.lineTotal ?? 0,
              sort_order: it.position ?? idx + 1,
            }))
          );
        }

        // 4. Increment next_invoice_number in organizations
        await supabase
          .from("organizations")
          .update({
            next_invoice_number: (org.next_invoice_number || 31) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orgId);

        return {
          ...localSaved,
          id: inserted.id,
          org_id: orgId,
          client_id: supabaseClientId || "",
        };
      } else if (invError) {
        console.warn("Supabase invoice insert error:", invError);
      }
    } catch (e) {
      console.warn("Supabase save sync notice:", e);
    }
  }

  return localSaved;
}

export async function updateInvoiceStatus(
  id: string,
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
): Promise<Invoice | null> {
  const localUpdated = mockStore.markStatus(id, status);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const updatePayload: any = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (status === "paid") {
        updatePayload.paid_at = new Date().toISOString();
      } else if (status === "sent") {
        updatePayload.sent_at = new Date().toISOString();
      } else if (status === "cancelled") {
        updatePayload.cancelled_at = new Date().toISOString();
      }

      await supabase
        .from("invoices")
        .update(updatePayload)
        .or(`id.eq.${id},number.eq.${id}`);
    } catch (e) {
      console.warn("Supabase status update notice:", e);
    }
  }

  return localUpdated || null;
}
