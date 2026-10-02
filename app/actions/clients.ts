"use server";

import { saveClient, deleteClient } from "@/lib/data/clients";
import { Client } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createClientAction(data: Partial<Client>) {
  try {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: "Le nom du client est requis." };
    }

    const client = await saveClient(data);

    revalidatePath("/clients");
    revalidatePath("/invoices/new");
    revalidatePath("/invoices");
    revalidatePath("/dashboard");

    return { success: true, client };
  } catch (error: any) {
    console.error("Erreur createClientAction:", error);
    return {
      success: false,
      error: error?.message || "Erreur lors de la création du client",
    };
  }
}

export async function deleteClientAction(id: string) {
  try {
    const success = await deleteClient(id);
    revalidatePath("/clients");
    revalidatePath("/invoices/new");
    return { success };
  } catch (error: any) {
    console.error("Erreur deleteClientAction:", error);
    return { success: false, error: error?.message || "Erreur de suppression" };
  }
}
