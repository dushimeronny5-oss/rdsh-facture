import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { getCurrency } from "./currency";

/**
 * Formats a currency amount in the specified currency.
 * Supported currencies:
 * - BIF : Franc burundais (ex: "1 250 000 FBu")
 * - CAD : Dollar canadien (ex: "1 250,00 $ CA")
 * - USD : Dollar américain (ex: "1 250,00 $ US")
 * - EUR : Euro (ex: "1 250,00 €")
 */
export function formatCurrency(
  amount: number | bigint | string | null | undefined,
  currencyCode: string = "BIF"
): string {
  if (amount === null || amount === undefined) {
    const cur = getCurrency(currencyCode);
    return `0 ${cur.symbol}`;
  }

  const cur = getCurrency(currencyCode);
  const numericValue =
    typeof amount === "bigint"
      ? Number(amount)
      : typeof amount === "string"
      ? Number(amount) || 0
      : amount;

  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: cur.decimals,
    maximumFractionDigits: cur.decimals,
  }).format(numericValue);

  return `${formatted} ${cur.symbol}`;
}

/**
 * Formats a currency amount in Burundi Francs (FBu / BIF).
 * Since FBu has no cents, amounts are always integers.
 * Example: 1250000 -> "1 250 000 FBu"
 */
export function formatFBu(
  amount: number | bigint | string | null | undefined
): string {
  return formatCurrency(amount, "BIF");
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
export function formatShortDate(
  date: string | Date | null | undefined
): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, "dd/MM/yyyy", { locale: fr });
  } catch {
    return String(date);
  }
}
