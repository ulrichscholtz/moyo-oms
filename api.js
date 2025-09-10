// src/pages/api.js
const API_BASE = "http://localhost:8080/api/users";

export async function createUser(user) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create user");
  }

  return response.json();
}

export async function getAllUsers() {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}
