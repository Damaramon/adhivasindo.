import { useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, listUsers, updateUser, User } from "../api/userService";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [msg, setMsg] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", is_active: true });

  async function refresh() {
    setMsg("");
    try {
      const res = await listUsers();
      setUsers(res.data);
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e?.message || "Failed to load users");
    }
  }

  useEffect(() => { refresh(); }, []);

  const me = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      await createUser(form);
      setForm({ name: "", email: "", password: "", role: "user", is_active: true });
      await refresh();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e?.message || "Create failed");
    }
  }

  async function onToggleActive(u: User) {
    try {
      await updateUser(u.id, { is_active: !u.is_active });
      await refresh();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e?.message || "Update failed");
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete user?")) return;
    try {
      await deleteUser(id);
      await refresh();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e?.message || "Delete failed");
    }
  }

  return (
    <div className="card">
      <h2>Users (CRUD)</h2>
      <p>
        <small>
          This endpoint is protected by <span className="badge">JWT</span> and <span className="badge">admin-only</span>.
          Logged in as: <b>{me?.email || "-"}</b>
        </small>
      </p>

      <form onSubmit={onCreate} className="row" style={{ marginBottom: 10 }}>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="name" />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email" />
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="password" type="password" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <select value={String(form.is_active)} onChange={(e) => setForm({ ...form, is_active: e.target.value === "true" })}>
          <option value="true">active</option>
          <option value="false">inactive</option>
        </select>
        <button type="submit">Create</button>
      </form>

      {msg && <p style={{ color: "#b00020" }}>{msg}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className="badge">{u.role}</span></td>
              <td>{String(u.is_active)}</td>
              <td className="row">
                <button className="secondary" onClick={() => onToggleActive(u)}>{u.is_active ? "Disable" : "Enable"}</button>
                <button className="danger" onClick={() => onDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
