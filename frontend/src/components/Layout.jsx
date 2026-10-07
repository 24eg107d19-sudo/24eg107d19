import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../api.js";

export default function Layout({ children, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  const links = [
    ["Wallet", "/wallet"],
    ["Send", "/send"],
    ["Receive", "/receive"],
    ["History", "/history"],
    ["QR Pay", "/pay"],
    ["Merchant", "/merchant"]
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/wallet">
          <span className="brand-icon">₿</span>
          <span><b>Campus</b><small>Crypto Wallet</small></span>
        </Link>
        <div className="student-mini">
          <div className="avatar">{(session?.name || "S").slice(0, 1).toUpperCase()}</div>
          <div><strong>{session?.name || "Student"}</strong><span>{session?.email || ""}</span></div>
        </div>
        <nav>
          {links.map(([label, path]) => (
            <Link className={location.pathname === path ? "nav-link active" : "nav-link"} key={path} to={path}>{label}</Link>
          ))}
        </nav>
        <button className="logout-btn" onClick={logout}>Log out</button>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div><p className="eyebrow">STUDENT WALLET</p><h1>{title}</h1><p className="subtitle">{subtitle}</p></div>
          <div className="status-pill"><span></span> Backend: localhost:8080</div>
        </header>
        {children}
      </main>
    </div>
  );
}
