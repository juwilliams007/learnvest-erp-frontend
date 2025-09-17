import { useState } from "react";

function AddEmployee({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("default123");  // ✅ default password
  const [role, setRole] = useState("employee");            // default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use Render API as fallback instead of localhost
  const API_URL =
    process.env.REACT_APP_API_URL || "https://learnvest-erp.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    setLoading(true);
    setError(null);

    try {
      const payload = { name, email, password, role };  // ✅ include password

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      setName("");
      setEmail("");
      setPassword("default123");  // reset to default
      setRole("employee");

      if (onAdded) onAdded();
    } catch (err) {
      console.error("❌ AddEmployee error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password (default: default123)"
        required
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="employee">Employee</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add User"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default AddEmployee;
