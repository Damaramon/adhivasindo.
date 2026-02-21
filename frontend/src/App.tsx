import { useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";
import { LoginForm } from "./components/LoginForm";
import { UsersPage } from "./components/UsersPage";
import { SearchPage } from "./components/SearchPage";

function Layout() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  const isAuthed = useMemo(() => !!localStorage.getItem("token"), [tick]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTick((x) => x + 1);
    navigate("/");
  }

  return (
    <div className="container">
      <h1>CAREER API Tester</h1>
      <div className="nav">
        <Link to="/">Home</Link>
        <Link to="/users">Users CRUD</Link>
        <Link to="/search">Remote Search</Link>
        {isAuthed && <button className="secondary" onClick={logout}>Logout</button>}
      </div>

      <Routes>
        <Route path="/" element={<Home onLoggedIn={() => setTick((x) => x + 1)} />} />
        <Route path="/users" element={isAuthed ? <UsersPage /> : <NeedLogin />} />
        <Route path="/search" element={isAuthed ? <SearchPage /> : <NeedLogin />} />
      </Routes>
    </div>
  );
}

function Home({ onLoggedIn }: { onLoggedIn: () => void }) {
  const isAuthed = !!localStorage.getItem("token");
  return (
    <div className="row" style={{ alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <LoginForm onLoggedIn={onLoggedIn} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="card">
          <h2>Notes</h2>
          <ul>
            <li>Login first to access <b>Users CRUD</b> and <b>Remote Search</b>.</li>
            <li>Users CRUD is admin-only by default (matches common company practice).</li>
            <li>Remote Search uses backend env <code>REMOTE_DATA_URL</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function NeedLogin() {
  return (
    <div className="card">
      <h2>Need Login</h2>
      <p>Please login first from Home page.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
