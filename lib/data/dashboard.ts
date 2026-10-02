import { mockStore } from "@/lib/mock/store";
import { getInvoices } from "@/lib/data/invoices";
import { DashboardStats } from "@/lib/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const all = await getInvoices();
  const nonCancelled = all.filter((i) => i.status !== "cancelled");

  let totalBilled = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let totalOverdue = 0;

  for (const inv of nonCancelled) {
    if (inv.status === "paid") {
      totalBilled += inv.total;
      totalPaid += inv.total;
    } else if (inv.status === "sent") {
      totalBilled += inv.total;
      if (inv.display_status === "overdue") {
        totalOverdue += inv.total;
      } else {
        totalPending += inv.total;
      }
    }
  }

  // Calculate monthly stats from active invoices
  const months = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
    "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
  ];
  const monthlyRevenue = months.map((month) => ({ month, billed: 0, paid: 0 }));

  for (const inv of nonCancelled) {
    if (!inv.issue_date) continue;
    const d = new Date(inv.issue_date);
    if (!isNaN(d.getTime())) {
      const monthIdx = d.getMonth();
      if (monthIdx >= 0 && monthIdx < 12) {
        if (inv.status === "paid" || inv.status === "sent") {
          monthlyRevenue[monthIdx].billed += inv.total;
        }
        if (inv.status === "paid") {
          monthlyRevenue[monthIdx].paid += inv.total;
        }
      }
    }
  }

  return {
    totalBilled,
    totalPaid,
    totalPending,
    totalOverdue,
    totalCount: nonCancelled.length,
    monthlyRevenue,
    recentInvoices: all.slice(0, 5),
  };
}
