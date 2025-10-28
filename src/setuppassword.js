import React, { useState, useEffect } from "react";

function SetupPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");

  const API_URL =
    process.env.REACT_APP_API_URL || "https://learnvest-erp.onrender.com/api";

  useEffect(() => {
    // Extract token from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get("token");
    if (inviteToken) {
      setToken(inviteToken);
    } else {
      setError("Invalid invite link. Token not found.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!token) {
      setError("Invalid invite token");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/setup-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to set password");
      }

      const data = await res.json();

      // Auto-login: save token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("id", data._id);

      setSuccess(true);

      // Redirect to main app after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Set Up Your Password
        </h2>

        {success ? (
          <div
            style={{
              backgroundColor: "#e8f5e9",
              padding: "20px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#2e7d32", margin: "0 0 10px 0" }}>
              ✅ Password Set Successfully!
            </h3>
            <p style={{ margin: "0" }}>
              Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <p style={{ color: "#666", fontSize: "0.9em", margin: "0 0 10px 0" }}>
              Welcome! Please create a password for your account.
            </p>

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />

            {error && (
              <div
                style={{
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  padding: "10px",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                }}
              >
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px",
                backgroundColor: loading ? "#ccc" : "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SetupPassword;
