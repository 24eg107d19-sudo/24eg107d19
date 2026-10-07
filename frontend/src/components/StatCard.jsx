import React from "react";
export default function StatCard({ label, value, icon }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}
