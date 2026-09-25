import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formats a currency amount in Burundi Francs (FBu / BIF).
 * Since FBu has no cents, amounts are always integers.
 * Example: 1250000 -> "1 250 000 FBu"
 */
export function formatFBu(amount: number | bigint | string | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "0 FBu";
  }

  const numericValue = typeof amount === "bigint"
    ? Number(amount)
    : typeof amount === "string"
    ? Math.round(Number(amount) || 0)
    : Math.round(amount);

  // Format with space as thousands separator
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(numericValue);

  return `${formatted} FBu`;
}

/**
 * Formats a standard French date.
 * Example: "2026-01-08" -> "8 janvier 2026"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, "d MMMM yyyy", { locale: fr });
  } catch {
    return String(date);
  }
}

/**
 * Formats a short date.
 * Example: "2026-01-08" -> "08/01/2026"
 */
export function formatShortDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, "dd/MM/yyyy", { locale: fr });
  } catch {
    return String(date);
  }
}
