import { createClient } from "@supabase/supabase-js";
import { initialClients, initialOrganization, mockStore } from "../lib/mock/store";
import fs from "fs";

if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qcyhectrkzurykfxdwdh.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseKey) {
  console.error("No Supabase key found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("=== SEEDING SUPABASE ===");

  // 1. Ensure Organization
  const orgId = "00000000-0000-0000-0000-000000000001";
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .upsert({
      id: orgId,
      name: initialOrganization.name,
      nif: initialOrganization.nif,
      rc: initialOrganization.rc,
      email: initialOrganization.email,
      phone: initialOrganization.phone,
      address: initialOrganization.address,
      city: initialOrganization.city,
      country: initialOrganization.country,
      currency: initialOrganization.currency || "BIF",
      default_tax_rate: initialOrganization.default_tax_rate,
      default_payment_terms_days: initialOrganization.default_payment_terms_days,
      invoice_prefix: initialOrganization.invoice_prefix,
      next_invoice_number: 31,
      payment_instructions: initialOrganization.payment_instructions,
      footer_note: initialOrganization.footer_note,
    }, { onConflict: "id" })
    .select()
    .single();

  if (orgError) {
    console.error("Error upserting organization:", orgError);
  } else {
    console.log("Organization upserted successfully:", orgData.name);
  }

  // 2. Seed Clients
  const clientMap = new Map<string, string>(); // oldId or name -> supabaseId

  // Fetch existing clients
  const { data: existingClients } = await supabase.from("clients").select("id, name");
  if (existingClients) {
    for (const c of existingClients) {
      clientMap.set(c.name.toLowerCase().trim(), c.id);
    }
  }

  for (const client of initialClients) {
    const key = client.name.toLowerCase().trim();
    if (!clientMap.has(key)) {
      const { data: inserted, error: clientErr } = await supabase
        .from("clients")
        .insert({
          organization_id: orgId,
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city || "Bujumbura",
          country: client.country || "Burundi",
          nif: client.nif,
          notes: client.notes,
        })
        .select()
        .single();

      if (clientErr) {
        console.error(`Error inserting client ${client.name}:`, clientErr);
      } else if (inserted) {
        clientMap.set(key, inserted.id);
        console.log(`Client inserted: ${inserted.name} (${inserted.id})`);
      }
    } else {
      console.log(`Client already exists: ${client.name}`);
    }
  }

  // 3. Seed Invoices and Items
  const { data: existingInvoices } = await supabase.from("invoices").select("number");
  const existingNumbers = new Set((existingInvoices || []).map((i) => i.number));

  const allInvoices = mockStore.getInvoices();
  console.log(`Total invoices to check: ${allInvoices.length}`);

  for (const inv of allInvoices) {
    if (existingNumbers.has(inv.number)) {
      console.log(`Invoice ${inv.number} already exists, skipping.`);
      continue;
    }

    // Resolve client
    let clientId: string | null = null;
    const clientKey = (inv.client_name || "").toLowerCase().trim();
    if (clientMap.has(clientKey)) {
      clientId = clientMap.get(clientKey)!;
    } else {
      // Find any client or use first
      const firstEntry = Array.from(clientMap.values())[0];
      clientId = firstEntry || null;
    }

    const { data: insertedInvoice, error: invError } = await supabase
      .from("invoices")
      .insert({
        organization_id: orgId,
        client_id: clientId,
        number: inv.number,
        status: inv.status,
        issue_date: inv.issue_date,
        due_date: inv.due_date,
        currency: inv.currency || "BIF",
        tax_rate: inv.tax_rate,
        subtotal: inv.subtotal,
        tax_amount: inv.tax_amount,
        total: inv.total,
        notes: inv.notes,
        payment_method: inv.payment_method || "lumicash",
        created_at: inv.created_at,
        updated_at: inv.updated_at,
      })
      .select()
      .single();

    if (invError || !insertedInvoice) {
      console.error(`Error inserting invoice ${inv.number}:`, invError);
      continue;
    }

    console.log(`Inserted invoice: ${insertedInvoice.number}`);

    // Insert invoice items
    if (inv.items && inv.items.length > 0) {
      const itemsToInsert = inv.items.map((item: any, idx: number) => ({
        invoice_id: insertedInvoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice ?? item.unit_price ?? 0,
        line_total: item.lineTotal ?? item.line_total ?? 0,
        sort_order: item.position ?? idx + 1,
      }));

      const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert);
      if (itemsError) {
        console.error(`Error inserting items for ${insertedInvoice.number}:`, itemsError);
      } else {
        console.log(`  Inserted ${itemsToInsert.length} items for ${insertedInvoice.number}`);
      }
    }
  }

  console.log("=== SEEDING COMPLETE ===");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Fatal seed error:", err);
    process.exit(1);
  });
