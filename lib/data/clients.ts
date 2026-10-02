import { mockStore } from "@/lib/mock/store";
import { Client } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/lib/data/organization";

export async function getClients(): Promise<Client[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const org = await getOrganization();

      let query = supabase
        .from("clients")
        .select("*")
        .order("name", { ascending: true });

      if (org?.id) {
        query = query.eq("organization_id", org.id);
      }

      const { data, error } = await query;

      if (!error && data) {
        return data as unknown as Client[];
      }
    } catch (e) {
      console.warn("Supabase clients fetch failed, falling back to local store:", e);
    }
  }
  return mockStore.getClients();
}

export async function getClientById(id: string): Promise<Client | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as unknown as Client;
      }
    } catch (e) {
      console.warn("Supabase client fetch failed, falling back to local store:", e);
    }
  }
  const client = mockStore.getClientById(id);
  return client || null;
}

export async function saveClient(data: Partial<Client>): Promise<Client> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const org = await getOrganization();
      const orgId = org.id || "00000000-0000-0000-0000-000000000001";
      const payload: any = {
        organization_id: orgId,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || "Bujumbura",
        country: data.country || "Burundi",
        nif: data.nif || null,
        notes: data.notes || null,
      };

      if (data.id && data.id.includes("-")) {
        payload.id = data.id;
      }

      const { data: inserted, error } = await supabase
        .from("clients")
        .insert(payload)
        .select()
        .single();

      if (!error && inserted) {
        const clientFormatted: Client = {
          id: inserted.id,
          org_id: inserted.organization_id,
          name: inserted.name,
          email: inserted.email || "",
          phone: inserted.phone || "",
          address: inserted.address || "",
          city: inserted.city || "Bujumbura",
          country: inserted.country || "Burundi",
          nif: inserted.nif || "",
          notes: inserted.notes || "",
          created_at: inserted.created_at,
          updated_at: inserted.updated_at,
        };
        mockStore.saveClient(clientFormatted);
        return clientFormatted;
      } else if (error) {
        console.warn("Supabase client save error:", error);
      }
    } catch (e) {
      console.warn("Supabase client save failed, falling back to local store:", e);
    }
  }
  return mockStore.saveClient(data);
}

export async function deleteClient(id: string): Promise<boolean> {
  let success = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (!error) success = true;
    } catch (e) {
      console.warn("Supabase deleteClient failed:", e);
    }
  }
  return success;
}
