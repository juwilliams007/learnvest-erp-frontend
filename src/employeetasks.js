import { useState, useEffect } from "react";

function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    process.env.REACT_APP_API_URL || "https://learnvest-erp.onrender.com/api";

  useEffect(() => {
    fetchTasks();
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
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !currentStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, completed: !currentStatus, completedAt: !currentStatus ? new Date() : null }
            : task
        )
      );

      if (!currentStatus) {
        alert("✅ Task marked as completed!");
      }
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>My Tasks</h3>

      {/* Pending Tasks */}
      <div style={{ marginBottom: "30px" }}>
        <h4 style={{ color: "#ff9800" }}>
          Pending Tasks ({pendingTasks.length})
        </h4>
        {pendingTasks.length === 0 ? (
          <p style={{ color: "#999" }}>No pending tasks. Great job!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pendingTasks.map((task) => (
              <div
                key={task._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "15px",
                  backgroundColor: "white",
                  borderLeft: `4px solid ${task.priority === "high" ? "#f44336" : task.priority === "medium" ? "#ff9800" : "#4caf50"}`,
                }}
              >
                <div style={{ display: "flex", gap: "15px", alignItems: "start" }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task._id, task.completed)}
                    style={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      marginTop: "3px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0" }}>
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
                    <div style={{ fontSize: "0.9em", color: "#999", marginTop: "8px" }}>
                      {task.dueDate && (
                        <span style={{ marginRight: "15px" }}>
                          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        Assigned by: {task.assignedBy?.name || "Admin"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h4 style={{ color: "#4caf50" }}>
            Completed Tasks ({completedTasks.length})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {completedTasks.map((task) => (
              <div
                key={task._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "15px",
                  backgroundColor: "#e8f5e9",
                  opacity: 0.8,
                }}
              >
                <div style={{ display: "flex", gap: "15px", alignItems: "start" }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task._id, task.completed)}
                    style={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      marginTop: "3px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0", textDecoration: "line-through", color: "#666" }}>
                      ✅ {task.title}
                    </h4>
                    {task.description && (
                      <p style={{ margin: "5px 0", color: "#666", fontSize: "0.9em" }}>{task.description}</p>
                    )}
                    <p style={{ fontSize: "0.85em", color: "#999", marginTop: "5px" }}>
                      Completed: {new Date(task.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTasks;
