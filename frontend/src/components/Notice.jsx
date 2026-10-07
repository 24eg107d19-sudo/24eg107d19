import React from "react";
export default function Notice({ message, type = "info" }) {
  if (!message) return null;
  return <div className={`notice ${type}`}>{message}</div>;
}
