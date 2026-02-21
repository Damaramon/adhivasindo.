import { useState } from "react";
import { searchByName, searchByNim, searchByYmd } from "../api/searchService";

export function SearchPage() {
  const [nama, setNama] = useState("Turner Mia");
  const [nim, setNim] = useState("9352078461");
  const [ymd, setYmd] = useState("20230405");
  const [out, setOut] = useState<any>(null);
  const [msg, setMsg] = useState("");

  async function run(fn: () => Promise<any>) {
    setMsg("");
    setOut(null);
    try {
      const res = await fn();
      setOut(res);
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e?.message || "Request failed");
    }
  }

  return (
    <div className="card">
      <h2>Remote Search (Protected)</h2>
      <p><small>These endpoints fetch data from the remote URL then filter it by NAMA / NIM / YMD.</small></p>

      <div className="row" style={{ marginBottom: 10 }}>
        <input value={nama} onChange={(e) => setNama(e.target.value)} />
        <button onClick={() => run(() => searchByName(nama))}>Search by Name</button>
      </div>

      <div className="row" style={{ marginBottom: 10 }}>
        <input value={nim} onChange={(e) => setNim(e.target.value)} />
        <button onClick={() => run(() => searchByNim(nim))}>Search by NIM</button>
      </div>

      <div className="row" style={{ marginBottom: 10 }}>
        <input value={ymd} onChange={(e) => setYmd(e.target.value)} />
        <button onClick={() => run(() => searchByYmd(ymd))}>Search by YMD</button>
      </div>

      {msg && <p style={{ color: "#b00020" }}>{msg}</p>}
      {out && (
        <pre style={{ whiteSpace: "pre-wrap", background: "#0b1020", color: "#e8e8e8", padding: 12, borderRadius: 12, overflowX: "auto" }}>
          {JSON.stringify(out, null, 2)}
        </pre>
      )}
    </div>
  );
}
