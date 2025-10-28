import { useState, useEffect } from "react";

function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const API_URL =
    process.env.REACT_APP_API_URL || "https://learnvest-erp.onrender.com/api";

  // Fetch tasks and employees on mount
  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch employees");

      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!title || !assignedTo) {
      setError("Title and employee are required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          assignedTo,
          priority,
          dueDate: dueDate || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create task");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setPriority("medium");
      setDueDate("");

      // Refresh tasks
      fetchTasks();
      alert("✅ Task assigned successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      fetchTasks();
      alert("✅ Task deleted successfully!");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Task Management</h2>

      {/* Create Task Form */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <h3>Assign New Task</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: "8px" }}
          />

          <textarea
            placeholder="Task Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ padding: "8px" }}
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
            style={{ padding: "8px" }}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ padding: "8px", flex: 1 }}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ padding: "8px", flex: 1 }}
            />
          </div>

          {error && <p style={{ color: "red", margin: "0" }}>❌ {error}</p>}

          <button type="submit" disabled={loading} style={{ padding: "10px", backgroundColor: "#2e7d32", color: "white", border: "none", borderRadius: "3px", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Assigning..." : "Assign Task"}
          </button>
        </form>
      </div>

      {/* Tasks List */}
      <h3>All Tasks ({tasks.length})</h3>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {tasks.map((task) => (
            <div
              key={task._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "15px",
                backgroundColor: task.completed ? "#e8f5e9" : "white",
                borderLeft: `4px solid ${task.priority === "high" ? "#f44336" : task.priority === "medium" ? "#ff9800" : "#4caf50"}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0" }}>
                    {task.completed && "✅ "}
                    {task.title}
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: "0.8em",
                        padding: "2px 8px",
                        borderRadius: "3px",
                        backgroundColor: task.priority === "high" ? "#ffebee" : task.priority === "medium" ? "#fff3e0" : "#e8f5e9",
                        color: task.priority === "high" ? "#c62828" : task.priority === "medium" ? "#e65100" : "#2e7d32",
                      }}
                    >
                      {task.priority}
                    </span>
                  </h4>
                  {task.description && (
                    <p style={{ margin: "5px 0", color: "#666" }}>{task.description}</p>
                  )}
                  <p style={{ margin: "5px 0", fontSize: "0.9em" }}>
                    <strong>Assigned to:</strong> {task.assignedTo?.name || "Unknown"} ({task.assignedTo?.email || "N/A"})
                  </p>
                  {task.dueDate && (
                    <p style={{ margin: "5px 0", fontSize: "0.9em" }}>
                      <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <p style={{ margin: "5px 0", fontSize: "0.85em", color: "#999" }}>
                    Created: {new Date(task.createdAt).toLocaleString()}
                    {task.completed && task.completedAt && ` • Completed: ${new Date(task.completedAt).toLocaleString()}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "0.9em",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminTasks ;
