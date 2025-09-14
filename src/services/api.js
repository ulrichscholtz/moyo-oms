const API_URL = process.env.REACT_APP_API_URL;

// Users endpoint
const USERS_API = `${API_URL}/users`;

export async function createUser(user) {
  const response = await fetch(USERS_API, {
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
  const response = await fetch(USERS_API);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

// Example test endpoint
export async function getData() {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
}
