"use server";

import { saveInvoice, updateInvoiceStatus } from "@/lib/data/invoices";
import { saveClient } from "@/lib/data/clients";
import { revalidatePath } from "next/cache";

export interface CreateInvoicePayload {
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientNif?: string;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  currency?: string;
  taxRate?: number;
  notes?: string;
  status: "draft" | "sent" | "paid";
  items: Array<{
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export async function createInvoiceAction(payload: CreateInvoicePayload) {
  try {
    let clientId = payload.clientId;

    // Automatically save new client if none selected
    if (!clientId && payload.clientName) {
      const newClient = await saveClient({
        name: payload.clientName,
        email: payload.clientEmail || "",
        address: payload.clientAddress || "",
        nif: payload.clientNif || "",
        city: "Bujumbura",
        country: "Burundi",
      });
      clientId = newClient.id;
    }

    const savedInvoice = await saveInvoice({
      client_id: clientId,
      client_name: payload.clientName,
      client_email: payload.clientEmail,
      client_address: payload.clientAddress,
      number: payload.invoiceNumber,
      status: payload.status,
      issue_date: payload.issueDate,
      due_date: payload.dueDate,
      currency: payload.currency || "BIF",
      tax_rate: payload.taxRate ?? 15,
      notes: payload.notes,
      items: payload.items,
    });

    // Revalidate dashboard and invoice pages so fresh data appears immediately
    revalidatePath("/dashboard");
    revalidatePath("/invoices");

    return { success: true, invoice: savedInvoice };
  } catch (error: any) {
    console.error("Erreur createInvoiceAction:", error);
    return { success: false, error: error?.message || "Erreur de création de facture" };
  }
}

export async function updateInvoiceStatusAction(
  id: string,
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
) {
  try {
    const updated = await updateInvoiceStatus(id, status);
    revalidatePath("/dashboard");
    revalidatePath("/invoices");
    return { success: true, invoice: updated };
  } catch (error: any) {
    console.error("Erreur updateInvoiceStatusAction:", error);
    return { success: false, error: error?.message || "Erreur de mise à jour du statut" };
  }
}
