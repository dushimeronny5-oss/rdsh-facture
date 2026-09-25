export interface LineItemInput {
  quantity: number;
  unitPrice: number | bigint;
}

export interface CalculatedItem extends LineItemInput {
  lineTotal: number;
}

export interface InvoiceCalculationResult {
  items: CalculatedItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

/**
 * Pure calculation logic for Burundi Francs (FBu).
 * Rules:
 * - Line total: round(quantity * unitPrice)
 * - Subtotal: sum of line totals
 * - Tax amount: round(subtotal * (taxRate / 100))
 * - Total: subtotal + taxAmount
 *
 * All amounts returned are integer numbers without cents.
 */
export function calculateInvoice(
  items: Array<{ quantity: number; unitPrice: number | bigint }>,
  taxRate: number = 15
): InvoiceCalculationResult {
  const safeTaxRate = Number.isFinite(taxRate) && taxRate >= 0 ? taxRate : 0;

  const calculatedItems = items.map((item) => {
    const qty = Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 0;
    const price = typeof item.unitPrice === "bigint"
      ? Number(item.unitPrice)
      : Number.isFinite(item.unitPrice) && item.unitPrice >= 0
      ? item.unitPrice
      : 0;

    const lineTotal = Math.round(qty * price);

    return {
      quantity: qty,
      unitPrice: Math.round(price),
      lineTotal,
    };
  });

  const subtotal = calculatedItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const taxAmount = Math.round((subtotal * safeTaxRate) / 100);
  const total = subtotal + taxAmount;

  return {
    items: calculatedItems,
    subtotal,
    taxRate: safeTaxRate,
    taxAmount,
    total,
  };
}
