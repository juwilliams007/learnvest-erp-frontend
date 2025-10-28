import { useState } from "react";

function AddEmployee({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inviteLink, setInviteLink] = useState(null);
  const [inviteExpiry, setInviteExpiry] = useState(null);

  const API_URL =
    process.env.REACT_APP_API_URL || "https://learnvest-erp.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    setLoading(true);
    setError(null);
    setInviteLink(null);

    try {
      const payload = { name, email, position };

      const res = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add employee");
      }

      const data = await res.json();

      setInviteLink(data.inviteLink);
      setInviteExpiry(data.inviteTokenExpiry);

      setName("");
      setEmail("");
      setPosition("");

      if (onAdded) onAdded();
    } catch (err) {
      console.error("❌ AddEmployee error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };

  return (
    <div>
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
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position (e.g. Developer, Designer)"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {inviteLink && (
        <div
          style={{
            backgroundColor: "#e8f5e9",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>
            ✅ Employee Created Successfully!
          </h4>
          <p style={{ margin: "5px 0" }}>
            <strong>Share this invite link with the employee:</strong>
          </p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <input
              type="text"
              value={inviteLink}
              readOnly
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "3px",
              }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                padding: "8px 15px",
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Copy Link
            </button>
          </div>
          <p style={{ margin: "10px 0 0 0", fontSize: "0.9em", color: "#666" }}>
            Link expires: {new Date(inviteExpiry).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default AddEmployee;
