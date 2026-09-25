export type StoredInvoiceStatus = "draft" | "sent" | "paid" | "cancelled";
export type DisplayInvoiceStatus = StoredInvoiceStatus | "overdue";

/**
 * Returns today's date string YYYY-MM-DD in Africa/Bujumbura (GMT+2) timezone.
 */
export function getBujumburaToday(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Bujumbura",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

/**
 * Computes display status based on stored status and due date.
 * An invoice is "overdue" if stored status is "sent" and due_date < today in Bujumbura.
 */
export function computeDisplayStatus(
  status: StoredInvoiceStatus,
  dueDate: string | null | undefined,
  todayStr: string = getBujumburaToday()
): DisplayInvoiceStatus {
  if (status === "sent" && dueDate) {
    // Extract YYYY-MM-DD from dueDate
    const dueFormatted = dueDate.substring(0, 10);
    if (dueFormatted < todayStr) {
      return "overdue";
    }
  }
  return status;
}

export const STATUS_LABELS: Record<DisplayInvoiceStatus, string> = {
  draft: "Brouillon",
  sent: "Envoyée",
  paid: "Payée",
  overdue: "En retard",
  cancelled: "Annulée",
};

export const STATUS_BADGE_VARIANTS: Record<
  DisplayInvoiceStatus,
  "secondary" | "info" | "success" | "warning" | "destructive"
> = {
  draft: "secondary",
  sent: "info",
  paid: "success",
  overdue: "warning",
  cancelled: "destructive",
};
