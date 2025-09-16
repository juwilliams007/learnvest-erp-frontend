import React, { useState, useEffect } from "react";

function Worklogs() {
  const [logs, setLogs] = useState([]);
  const [tasks, setTasks] = useState("");
  const [nextDayPlan, setNextDayPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  // Fetch my logs
  const fetchLogs = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/worklogs/employee/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("❌ Error fetching worklogs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, []);

  // Submit new log
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      employeeId: userId,
      clockIn: new Date(),
      tasks: tasks.split(",").map((t) => t.trim()),
      nextDayPlan,
    };

    try {
      const res = await fetch(`${API_URL}/worklogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit worklog");

      setTasks("");
      setNextDayPlan("");
      fetchLogs();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Export logs to CSV
  const handleExport = () => {
    if (logs.length === 0) {
      alert("No logs to export");
      return;
    }

    const header = ["Date", "Tasks", "Next Day Plan"];
    const rows = logs.map((log) => [
      new Date(log.date).toLocaleDateString(),
      log.tasks.join("; "),
      log.nextDayPlan || "",
    ]);

    const csvContent =
      [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "worklogs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>My Worklogs</h2>
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <textarea
          placeholder="Tasks (comma-separated)"
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          required
          style={{ width: "100%", padding: "8px" }}
        />
        <textarea
          placeholder="Plan for next day"
          value={nextDayPlan}
          onChange={(e) => setNextDayPlan(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Worklog"}
        </button>
      </form>

      <h3>Previous Logs</h3>
      {logs.length > 0 ? (
        <>
          <button onClick={handleExport} style={{ marginBottom: "10px" }}>
            📤 Export to CSV
          </button>
          <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Tasks</th>
                <th>Next Day Plan</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {log.tasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{log.nextDayPlan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No worklogs yet.</p>
      )}
    </div>
  );
}

export default Worklogs;
