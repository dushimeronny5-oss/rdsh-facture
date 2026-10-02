"use server";

import { updateOrganization } from "@/lib/data/organization";
import { Organization } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateOrganizationAction(data: Partial<Organization>) {
  try {
    const updated = await updateOrganization(data);

    // Revalidate all pages that depend on organization settings
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/invoices");
    revalidatePath("/invoices/new");

    return { success: true, organization: updated };
  } catch (error: any) {
    console.error("Erreur updateOrganizationAction:", error);
    return {
      success: false,
      error: error?.message || "Erreur lors de la mise à jour des paramètres",
    };
  }
}
