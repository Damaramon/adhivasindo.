import axios from "axios";
import { HttpError } from "../utils/httpError.js";

type RemoteRow = { NIM: string; YMD: string; NAMA: string };

function parsePipeTable(dataStr: string): RemoteRow[] {
  const lines = dataStr
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const header = lines[0].split("|").map((h) => h.trim().toUpperCase());
  const idxNIM = header.indexOf("NIM");
  const idxYMD = header.indexOf("YMD");
  const idxNAMA = header.indexOf("NAMA");

  if (idxNIM < 0 || idxYMD < 0 || idxNAMA < 0) {
    throw new HttpError(502, "Remote DATA header invalid (expected NIM|YMD|NAMA)");
  }

  const rows: RemoteRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split("|");
    if (parts.length < header.length) continue;

    rows.push({
      NIM: (parts[idxNIM] ?? "").trim(),
      YMD: (parts[idxYMD] ?? "").trim(),
      NAMA: (parts[idxNAMA] ?? "").trim()
    });
  }
  return rows;
}
export function filterByNama(rows: any[], nama: string) {
  const q = nama.trim().toLowerCase();
  return rows.filter(
    (r) => String(r?.NAMA ?? r?.nama ?? r?.name ?? "").trim().toLowerCase() === q
  );
}

export function filterByNim(rows: any[], nim: string) {
  const q = nim.trim();
  return rows.filter((r) => String(r?.NIM ?? r?.nim ?? "").trim() === q);
}

export function filterByYmd(rows: any[], ymd: string) {
  const q = ymd.trim();
  return rows.filter((r) => String(r?.YMD ?? r?.ymd ?? r?.date ?? "").trim() === q);
}
export async function fetchRemoteData(): Promise<any[]> {
  const url = process.env.REMOTE_DATA_URL;
  if (!url) throw new HttpError(500, "REMOTE_DATA_URL not configured");

  try {
   
    const resp = await axios.get(url, {
      timeout: 20000,
      responseType: "text",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json,text/plain,*/*"
      },
      transformResponse: (r) => r
    });

    let raw = resp.data;

    if (Buffer.isBuffer(raw)) raw = raw.toString("utf8");
    if (typeof raw !== "string") {
      raw = JSON.stringify(raw);
    }

    const s = raw.trim();

    if (s.startsWith("{") || s.startsWith("[")) {
      try {
        const payload = JSON.parse(s);

        if (payload && typeof payload === "object" && typeof payload.DATA === "string") {
          return parsePipeTable(payload.DATA);
        }

        if (Array.isArray(payload)) return payload;
      } catch {
      }
    }

    if (s.includes("NIM|YMD|NAMA")) {
      return parsePipeTable(s);
    }

    throw new HttpError(502, "Unexpected remote payload format", {
      status: resp.status,
      contentType: resp.headers?.["content-type"],
      preview: s.slice(0, 200)
    });
  } catch (e: any) {
    if (e instanceof HttpError) throw e;

    throw new HttpError(502, "Failed to fetch remote data", {
      cause: e?.message ?? String(e)
    });
  }
}