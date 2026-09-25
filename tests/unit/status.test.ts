import { describe, it, expect } from "vitest";
import { computeDisplayStatus } from "@/lib/invoice/status";

describe("computeDisplayStatus", () => {
  const referenceToday = "2026-09-24";

  it("keeps draft status as draft even if due date is in the past", () => {
    const status = computeDisplayStatus("draft", "2026-09-01", referenceToday);
    expect(status).toBe("draft");
  });

  it("marks sent invoice as overdue if due date < today", () => {
    const status = computeDisplayStatus("sent", "2026-09-23", referenceToday);
    expect(status).toBe("overdue");
  });

  it("keeps sent invoice as sent if due date >= today", () => {
    const statusToday = computeDisplayStatus("sent", "2026-09-24", referenceToday);
    expect(statusToday).toBe("sent");

    const statusFuture = computeDisplayStatus("sent", "2026-10-15", referenceToday);
    expect(statusFuture).toBe("sent");
  });

  it("keeps paid invoice as paid even if due date was in the past", () => {
    const status = computeDisplayStatus("paid", "2026-08-01", referenceToday);
    expect(status).toBe("paid");
  });

  it("keeps cancelled invoice as cancelled", () => {
    const status = computeDisplayStatus("cancelled", "2026-08-01", referenceToday);
    expect(status).toBe("cancelled");
  });
});
