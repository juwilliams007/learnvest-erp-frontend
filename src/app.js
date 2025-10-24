import React, { useState, useEffect } from "react";
import Login from "./login";
import AddEmployee from "./addemployee";
import Employees from "./employees";
import Worklogs from "./worklogs";

function App() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]); // ✅ state for attendance logs
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.REACT_APP_API_URL || "https://learnvest-erp.onrender.com/api";

  // Restore session if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("id");

    if (token && role) {
      setUser({ token, role, name, email, id });
    }
  }, []);

  // Save user info to localStorage when logging in
  const handleLogin = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("name", userData.name);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("id", userData._id);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAttendance([]);
  };

  // === Employee Actions ===
  const handleClockIn = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/attendance/clockin`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to clock in");
      }

      alert("✅ Clock-in recorded");
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/attendance/clockout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to clock out");
      }

      alert("✅ Clock-out recorded");
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/attendance/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch attendance");
      }

      const data = await res.json();
      setAttendance(data);
    } catch (err) {
      alert("❌ Error: " + err.message);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Login setUser={handleLogin} />;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Learnvest ERP</h1>
      <p style={{ textAlign: "center" }}>
        Logged in as <strong>{user.name}</strong> ({user.role}){" "}
        <button onClick={handleLogout}>Logout</button>
      </p>

      {user.role === "admin" ? (
        <>
          <h2>Add User</h2>
          <AddEmployee onAdded={() => window.location.reload()} />

          <h2>Users</h2>
          <Employees />
        </>
      ) : (
        <>
          <h2>Welcome {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>

          <div style={{ marginBottom: "15px" }}>
            <button onClick={handleClockIn} disabled={loading}>
              {loading ? "Processing..." : "Clock In"}
            </button>
            <button onClick={handleClockOut} disabled={loading}>
              {loading ? "Processing..." : "Clock Out"}
            </button>
            <button onClick={handleViewAttendance} disabled={loading}>
              {loading ? "Loading..." : "View My Attendance"}
            </button>
          </div>

          {attendance.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>My Attendance Records</h3>
              <table
                border="1"
                cellPadding="8"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((r, idx) => (
                    <tr key={idx}>
                      <td>{r.type.toUpperCase()}</td>
                      <td>{new Date(r.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2>Worklogs</h2>
          <Worklogs />
        </>
      )}
    </div>
  );
}

export default App;
