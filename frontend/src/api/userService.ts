import { api } from "./axios";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function listUsers() {
  const res = await api.get("/api/users");
  return res.data as { success: boolean; data: User[] };
}

export async function createUser(payload: { name: string; email: string; password: string; role: string; is_active: boolean }) {
  const res = await api.post("/api/users", payload);
  return res.data;
}

export async function updateUser(id: number, patch: any) {
  const res = await api.put(`/api/users/${id}`, patch);
  return res.data;
}

export async function deleteUser(id: number) {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
}
