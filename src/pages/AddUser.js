// src/pages/AddUser.js
import { useState } from "react";
import { createUser } from "../api";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const newUser = await createUser({ name, email });
      setMessage(`User "${newUser.name}" added successfully!`);
      setName("");
      setEmail("");
    } catch (error) {
      setMessage(error.message || "Failed to add user.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New User</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>Add User</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  label: { display: "flex", flexDirection: "column", fontSize: "14px", fontWeight: "bold" },
  input: { padding: "8px", marginTop: "5px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" },
  button: { padding: "10px", fontSize: "16px", borderRadius: "4px", border: "none", backgroundColor: "#4CAF50", color: "white", cursor: "pointer" },
  message: { marginTop: "15px", textAlign: "center", color: "#333" },
};
