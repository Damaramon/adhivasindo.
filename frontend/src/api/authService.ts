import { api } from "./axios";

export async function login(email: string, password: string) {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data as { success: boolean; token: string; user: any };
}
