import { mockStore } from "@/lib/mock/store";
import { Organization } from "@/lib/types";

export async function getOrganization(): Promise<Organization> {
  return mockStore.getOrganization();
}

export async function updateOrganization(
  data: Partial<Organization>
): Promise<Organization> {
  return mockStore.updateOrganization(data);
}
