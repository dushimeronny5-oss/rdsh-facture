import { mockStore } from "@/lib/mock/store";
import { Client } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createClient } from "@/lib/supabase/server";

export async function getClients(): Promise<Client[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
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
      const { data: inserted, error } = await supabase
        .from("clients")
        .insert(data)
        .select()
        .single();

      if (!error && inserted) {
        return inserted as unknown as Client;
      }
    } catch (e) {
      console.warn("Supabase client save failed, falling back to local store:", e);
    }
  }
  return mockStore.saveClient(data);
}
