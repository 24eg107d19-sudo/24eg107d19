const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }
  return data;
}

export const api = {
  login: (email, password) => request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  }),
  signup: (body) => request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body)
  }),
  wallet: (userId) => request(`/wallet/${userId}`),
  addMoney: (userId, amount) => request(`/wallet/${userId}/add?amount=${encodeURIComponent(amount)}`, { method: "POST" }),
  transactions: (userId) => request(`/wallet/${userId}/transactions`),
  recipient: (address) => request(`/wallet/recipient?address=${encodeURIComponent(address)}`),
  send: (userId, { address, amount, category, note }) => request(
    `/wallet/${userId}/send?address=${encodeURIComponent(address)}&amount=${encodeURIComponent(amount)}&category=${encodeURIComponent(category)}&note=${encodeURIComponent(note || "")}`,
    { method: "POST" }
  ),
  student: (userId) => request(`/student/${userId}`),
  updateStudent: (userId, body) => request(`/student/${userId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  })
};

export function getSession() {
  const userId = localStorage.getItem("userId");
  if (!userId) return null;
  return {
    userId: Number(userId),
    name: localStorage.getItem("userName") || "Student",
    email: localStorage.getItem("userEmail") || ""
  };
}

export function saveSession(data) {
  localStorage.setItem("userId", String(data.id));
  localStorage.setItem("userName", data.name || "Student");
  localStorage.setItem("userEmail", data.email || "");
}

export function clearSession() {
  ["userId", "userName", "userEmail"].forEach((key) => localStorage.removeItem(key));
}
