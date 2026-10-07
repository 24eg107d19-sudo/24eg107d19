import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, saveSession } from "../api.js";
import Notice from "../components/Notice.jsx";

const initial = { name:"", email:"", password:"", studentId:"", department:"", year:"2nd Year", college:"" };
export default function Register() {
  const [form, setForm] = useState(initial); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const navigate = useNavigate();
  const set = (key) => (e) => setForm({...form, [key]: e.target.value});
  async function submit(e) { e.preventDefault(); setMessage(""); setBusy(true); try { const data = await api.signup(form); if (!data.success) throw new Error(data.message || "Signup failed"); saveSession(data); navigate("/wallet"); } catch(err){setMessage(err.message);} finally{setBusy(false);} }
  return <div className="auth-page"><div className="auth-card wide">
    <div className="auth-brand"><span>₿</span><div><b>Campus Crypto Wallet</b><small>Student payment prototype</small></div></div>
    <h1>Create your wallet</h1><p className="muted">Create a student profile and your wallet together.</p><Notice message={message} type="error" />
    <form onSubmit={submit} className="form-grid">
      <label>Full name<input value={form.name} onChange={set("name")} required /></label>
      <label>Email<input type="email" value={form.email} onChange={set("email")} required /></label>
      <label>Password<input type="password" value={form.password} onChange={set("password")} required /></label>
      <label>Student ID<input value={form.studentId} onChange={set("studentId")} required /></label>
      <label>Department<input value={form.department} onChange={set("department")} placeholder="AIML" required /></label>
      <label>Year<select value={form.year} onChange={set("year")}><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></label>
      <label className="full">College<input value={form.college} onChange={set("college")} required /></label>
      <button className="primary-btn full" disabled={busy}>{busy ? "Creating..." : "Create wallet"}</button>
    </form>
    <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
  </div></div>;
}
