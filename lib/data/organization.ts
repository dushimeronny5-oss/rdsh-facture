import { mockStore } from "@/lib/mock/store";
import { Organization } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createClient } from "@/lib/supabase/server";

export async function getOrganization(): Promise<Organization> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .limit(1)
        .single();

      if (!error && data) {
        return data as unknown as Organization;
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
