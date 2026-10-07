import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, saveSession } from "../api.js";
import Notice from "../components/Notice.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault(); setMessage(""); setBusy(true);
    try {
      const data = await api.login(email.trim(), password);
      if (!data.success) throw new Error(data.message || "Invalid email or password");
      saveSession(data); navigate("/wallet");
    } catch (err) { setMessage(err.message); }
    finally { setBusy(false); }
  }

  return <div className="auth-page"><div className="auth-card">
    <div className="auth-brand"><span>₿</span><div><b>Campus Crypto Wallet</b><small>Student payment prototype</small></div></div>
    <h1>Welcome back</h1><p className="muted">Sign in to manage your student wallet.</p>
    <Notice message={message} type="error" />
    <form onSubmit={submit} className="form-stack">
      <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
      <button className="primary-btn" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
    </form>
    <p className="auth-footer">New student? <Link to="/register">Create an account</Link></p>
  </div></div>;
}
