import { describe, it, expect } from "vitest";
import { mockStore } from "@/lib/mock/store";
import { getInvoices, saveInvoice } from "@/lib/data/invoices";
import { getDashboardStats } from "@/lib/data/dashboard";

describe("Invoice Creation & Dashboard Integration", () => {
  it("adds newly created invoice to the store and updates dashboard stats", async () => {
    const initialInvoices = await getInvoices();
    const initialCount = initialInvoices.length;
    const initialStats = await getDashboardStats();

    // Create a new invoice
    const newInvoice = await saveInvoice({
      client_name: "Test Entreprise SARL",
      client_email: "test@entreprise.bi",
      client_address: "Avenue de l'Indépendance",
      status: "sent",
      issue_date: "2026-09-26",
      due_date: "2026-10-26",
      currency: "BIF",
      tax_rate: 15,
      items: [
        {
          description: "Développement Application Web",
          quantity: 1,
          unitPrice: 500000,
        },
      ],
    });

    expect(newInvoice).toBeDefined();
    expect(newInvoice.client_name).toBe("Test Entreprise SARL");
    expect(newInvoice.subtotal).toBe(500000);
    expect(newInvoice.tax_amount).toBe(75000);
    expect(newInvoice.total).toBe(575000);

    // Verify invoice list
    const updatedInvoices = await getInvoices();
    expect(updatedInvoices.length).toBe(initialCount + 1);

    // The newly created invoice should be present in the invoice list
    const foundInvoice = updatedInvoices.find(
      (inv) => inv.id === newInvoice.id
    );
    expect(foundInvoice).toBeDefined();
    expect(foundInvoice?.client_name).toBe("Test Entreprise SARL");

    // Verify dashboard stats updated
    const updatedStats = await getDashboardStats();
    expect(updatedStats.totalCount).toBe(initialStats.totalCount + 1);
    expect(updatedStats.totalBilled).toBe(initialStats.totalBilled + 575000);

    // Clean up test invoice from database and mock store
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const { isSupabaseConfigured } = await import("@/lib/supabase/is-configured");
      if (isSupabaseConfigured()) {
        const supabase = await createClient();
        await supabase.from("invoice_items").delete().eq("invoice_id", newInvoice.id);
        await supabase.from("invoices").delete().eq("id", newInvoice.id);
      }
    } catch {}

    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "lib", "mock", ".custom_invoices.json");
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf-8");
    }
  });
});
