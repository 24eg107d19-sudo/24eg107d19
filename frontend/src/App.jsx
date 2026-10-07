import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Wallet from "./pages/Wallet.jsx";
import Send from "./pages/Send.jsx";
import Receive from "./pages/Receive.jsx";
import History from "./pages/History.jsx";
import Pay from "./pages/Pay.jsx";
import Merchant from "./pages/Merchant.jsx";
import { getSession } from "./api.js";

function Protected({ children }) {
  return getSession() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={getSession() ? "/wallet" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/wallet" element={<Protected><Wallet /></Protected>} />
      <Route path="/send" element={<Protected><Send /></Protected>} />
      <Route path="/receive" element={<Protected><Receive /></Protected>} />
      <Route path="/history" element={<Protected><History /></Protected>} />
      <Route path="/pay" element={<Protected><Pay /></Protected>} />
      <Route path="/merchant" element={<Protected><Merchant /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
