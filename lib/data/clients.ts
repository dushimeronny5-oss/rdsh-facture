import { mockStore } from "@/lib/mock/store";
import { Client } from "@/lib/types";

export async function getClients(): Promise<Client[]> {
  return mockStore.getClients();
}

export async function getClientById(id: string): Promise<Client | null> {
  const client = mockStore.getClientById(id);
  return client || null;
}

export async function saveClient(data: Partial<Client>): Promise<Client> {
  return mockStore.saveClient(data);
}
