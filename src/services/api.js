import keycloak from "./keycloak";

const API_URL = process.env.REACT_APP_API_URL;

// Users endpoint
const USERS_API = `${API_URL}/users`;

// Authenticated fetch helper
export async function fetchWithAuth(url, options = {}) {
  const token = keycloak.token;
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  return fetch(url, { ...options, headers });
}

export async function createUser(user) {
  const response = await fetchWithAuth(USERS_API, {
    method: "POST",
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create user");
  }

  return response.json();
}

export async function getAllUsers() {
  const response = await fetchWithAuth(USERS_API);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

// Example test endpoint
export async function getData() {
  const response = await fetchWithAuth(`${API_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
}
