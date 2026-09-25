import { describe, it, expect } from "vitest";
import { calculateInvoice } from "@/lib/invoice/calc";

describe("calculateInvoice", () => {
  it("calculates single line item without tax", () => {
    const result = calculateInvoice([{ quantity: 2, unitPrice: 150000 }], 0);
    expect(result.subtotal).toBe(300000);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(300000);
  });

  it("calculates exact user example: 2 x 150 000 + 1 x 75 500 with 15% VAT", () => {
    // 2 x 150 000 = 300 000
    // 1 x 75 500 = 75 500
    // subtotal = 375 500
    // tax = round(375500 * 0.15) = 56 325
    // total = 375500 + 56325 = 431 825
    const result = calculateInvoice(
      [
        { quantity: 2, unitPrice: 150000 },
        { quantity: 1, unitPrice: 75500 },
      ],
      15
    );

    expect(result.subtotal).toBe(375500);
    expect(result.taxAmount).toBe(56325);
    expect(result.total).toBe(431825);
  });

  it("handles decimal quantities with integer unit prices", () => {
    // 2.5 days x 100 000 FBu = 250 000
    const result = calculateInvoice([{ quantity: 2.5, unitPrice: 100000 }], 15);
    expect(result.subtotal).toBe(250000);
    expect(result.taxAmount).toBe(37500);
    expect(result.total).toBe(287500);
  });

  it("correctly rounds integer tax amounts", () => {
    // subtotal 100 FBu with 15% tax = 15 FBu
    // subtotal 103 FBu with 15% tax = 15.45 -> 15 FBu
    // subtotal 105 FBu with 15% tax = 15.75 -> 16 FBu
    const res1 = calculateInvoice([{ quantity: 1, unitPrice: 103 }], 15);
    expect(res1.taxAmount).toBe(15);
    expect(res1.total).toBe(118);

    const res2 = calculateInvoice([{ quantity: 1, unitPrice: 105 }], 15);
    expect(res2.taxAmount).toBe(16);
    expect(res2.total).toBe(121);
  });

  it("handles empty items gracefully", () => {
    const result = calculateInvoice([], 15);
    expect(result.subtotal).toBe(0);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(0);
  });
});
