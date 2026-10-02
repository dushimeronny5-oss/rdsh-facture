import { mockStore } from "@/lib/mock/store";
import { Organization } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createClient } from "@/lib/supabase/server";

export async function getOrganization(): Promise<Organization> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let query = supabase.from("organizations").select("*");
      if (user?.id) {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "Bujumbura",
          country: data.country || "Burundi",
          nif: data.nif || "",
          rc: data.rc || "",
          logo_path: data.logo_path || null,
          default_tax_rate: Number(data.default_tax_rate) || 15,
          default_payment_terms_days: Number(data.default_payment_terms_days) || 30,
          invoice_prefix: data.invoice_prefix || "RDSH",
          next_invoice_number: Number(data.next_invoice_number) || 1,
          payment_instructions:
            data.payment_instructions ||
            "Paiement par virement bancaire sur notre compte IBB ou par Lumicash Marchand.",
          footer_note:
            data.footer_note ||
            "Merci pour votre confiance. Facture payable sous 30 jours.",
          currency: data.currency || "BIF",
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn("Supabase organization fetch failed, falling back to local store:", e);
    }
  }
  return mockStore.getOrganization();
}

export async function updateOrganization(
  data: Partial<Organization>
): Promise<Organization> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const org = await getOrganization();
      const { data: updated, error } = await supabase
        .from("organizations")
        .update(data)
        .eq("id", org.id)
        .select()
        .single();

      if (!error && updated) {
        return updated as unknown as Organization;
      }
    } catch (e) {
      console.warn("Supabase organization update failed, falling back to local store:", e);
    }
  }
  return mockStore.updateOrganization(data);
}
