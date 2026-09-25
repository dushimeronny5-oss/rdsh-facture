import { mockStore } from "@/lib/mock/store";
import { Invoice } from "@/lib/types";

export async function getInvoices(): Promise<Invoice[]> {
  return mockStore.getInvoices();
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const inv = mockStore.getInvoiceById(id);
  return inv || null;
}

export async function saveInvoice(data: any): Promise<Invoice> {
  return mockStore.saveInvoice(data);
}

export async function updateInvoiceStatus(
  id: string,
  status: "sent" | "paid" | "cancelled"
): Promise<Invoice | null> {
  const inv = mockStore.markStatus(id, status);
  return inv || null;
}
