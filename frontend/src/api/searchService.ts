import { api } from "./axios";

export async function searchByName(nama: string) {
  const res = await api.get(`/api/search/name/${encodeURIComponent(nama)}`);
  return res.data;
}
export async function searchByNim(nim: string) {
  const res = await api.get(`/api/search/nim/${encodeURIComponent(nim)}`);
  return res.data;
}
export async function searchByYmd(ymd: string) {
  const res = await api.get(`/api/search/ymd/${encodeURIComponent(ymd)}`);
  return res.data;
}
