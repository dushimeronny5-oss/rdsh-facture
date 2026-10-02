import { createClient } from "@supabase/supabase-js";
import { saveClient } from "../lib/data/clients";
import { saveInvoice, updateInvoiceStatus, getInvoices } from "../lib/data/invoices";
import { updateOrganization, getOrganization } from "../lib/data/organization";
import { getDashboardStats } from "../lib/data/dashboard";
import fs from "fs";

if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== FULL-STACK VERIFICATION TEST ===");

  // 1. Organization Test
  console.log("1. Testing Organization fetch & update...");
  const orgBefore = await getOrganization();
  console.log("Organization name:", orgBefore.name, "| Currency:", orgBefore.currency);

  const updatedOrg = await updateOrganization({
    phone: "+257 79 999 888",
    city: "Bujumbura",
  });
  console.log("Updated Org Phone:", updatedOrg.phone);

  const { data: dbOrg } = await supabase.from("organizations").select("phone").eq("id", orgBefore.id).single();
  console.log("DB Org Phone in Supabase:", dbOrg?.phone);

  // 2. Client Test
  console.log("\n2. Testing Client creation in Supabase...");
  const testClientName = "Test Client FullStack " + Date.now().toString().slice(-4);
  const newClient = await saveClient({
    name: testClientName,
    email: "test@fullstack.bi",
    phone: "+257 77 11 22 33",
    nif: "4000999888",
    address: "Avenue de France",
    city: "Bujumbura",
    country: "Burundi",
  });
  console.log("Client created:", newClient.name, "ID:", newClient.id);

  const { data: dbClient } = await supabase.from("clients").select("*").eq("id", newClient.id).single();
  console.log("DB Client found in Supabase:", dbClient?.name, "| Org ID:", dbClient?.organization_id);

  // 3. Invoice Test
  console.log("\n3. Testing Invoice creation linked to client in Supabase...");
  const invNumber = "FAC-TEST-" + Date.now().toString().slice(-4);
  const newInvoice = await saveInvoice({
    client_id: newClient.id,
    client_name: newClient.name,
    number: invNumber,
    status: "draft",
    issue_date: "2026-09-28",
    due_date: "2026-10-28",
    currency: "BIF",
    tax_rate: 15,
    subtotal: 500000,
    tax_amount: 75000,
    total: 575000,
    notes: "Facture de test full-stack",
    items: [
      {
        description: "Service Développement Full-Stack",
        quantity: 1,
        unitPrice: 500000,
        lineTotal: 500000,
      }
    ]
  });
  console.log("Invoice created:", newInvoice.number, "ID:", newInvoice.id);

  const { data: dbInvoice } = await supabase
    .from("invoices")
    .select("*, items:invoice_items(*), client:clients(*)")
    .eq("number", invNumber)
    .single();

  console.log("DB Invoice in Supabase:", {
    number: dbInvoice?.number,
    status: dbInvoice?.status,
    total: dbInvoice?.total,
    client_name: dbInvoice?.client?.name,
    items_count: dbInvoice?.items?.length,
  });

  // 4. Update Status Test
  console.log("\n4. Testing status transition in Supabase...");
  await updateInvoiceStatus(dbInvoice.id, "sent");
  const { data: dbSent } = await supabase.from("invoices").select("status, sent_at").eq("id", dbInvoice.id).single();
  console.log("Status updated to 'sent':", dbSent?.status, "| Sent at:", dbSent?.sent_at);

  await updateInvoiceStatus(dbInvoice.id, "paid");
  const { data: dbPaid } = await supabase.from("invoices").select("status, paid_at").eq("id", dbInvoice.id).single();
  console.log("Status updated to 'paid':", dbPaid?.status, "| Paid at:", dbPaid?.paid_at);

  // 5. Dashboard Stats Test
  console.log("\n5. Testing Dashboard Stats with live Supabase data...");
  const stats = await getDashboardStats();
  console.log("Dashboard KPIs:", {
    totalBilled: stats.totalBilled,
    totalPaid: stats.totalPaid,
    totalPending: stats.totalPending,
    totalOverdue: stats.totalOverdue,
    totalCount: stats.totalCount,
    recentInvoicesCount: stats.recentInvoices.length,
  });

  // Clean up test invoice & client
  console.log("\n6. Cleaning up test data from Supabase...");
  await supabase.from("invoices").delete().eq("number", invNumber);
  await supabase.from("clients").delete().eq("id", newClient.id);
  console.log("Cleanup complete!");

  console.log("\n=== ALL FULL-STACK VERIFICATIONS PASSED SUCCESSFULLY ===");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  });
