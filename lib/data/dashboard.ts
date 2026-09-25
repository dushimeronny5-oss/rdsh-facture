import { mockStore } from "@/lib/mock/store";
import { DashboardStats } from "@/lib/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  return mockStore.getDashboardStats();
}
