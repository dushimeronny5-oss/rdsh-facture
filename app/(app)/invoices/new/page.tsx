import * as React from "react";
import { getOrganization } from "@/lib/data/organization";
import { getClients } from "@/lib/data/clients";
import { InvoiceForm } from "@/components/invoices/invoice-form";

export const revalidate = 0;

export default async function NewInvoicePage() {
  const [organization, clients] = await Promise.all([
    getOrganization(),
    getClients(),
  ]);

  return (
    <div>
      <InvoiceForm organization={organization} clients={clients} />
    </div>
  );
}
