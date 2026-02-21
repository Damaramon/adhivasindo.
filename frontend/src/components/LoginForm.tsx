import { useState } from "react";
import { login } from "../api/authService";

export function LoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin12345!");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await login(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      onLoggedIn();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e?.message || "Login failed");
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <p><small>Use default seeded admin or your created users.</small></p>
      <form onSubmit={onSubmit} className="row">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        <button type="submit">Login</button>
      </form>
      {msg && <p style={{ color: "#b00020" }}>{msg}</p>}
    </div>
  );
}
