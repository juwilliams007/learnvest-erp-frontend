import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

  // ✅ Base API URL (points to /api)
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch employees
  const fetchEmployees = () => {
    axios
      .get(`${API_URL}/employees`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Add employee
  const addEmployee = () => {
    if (!name || !email || !position) {
      alert("All fields are required!");
      return;
    }

    axios
      .post(`${API_URL}/employees`, { name, email, position })
      .then(() => {
        fetchEmployees(); // refresh list
        setName("");
        setEmail("");
        setPosition("");
      })
      .catch((err) => console.error("Error adding employee:", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Learnvest ERP</h1>

      <h2>Add Employee</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />
      <button onClick={addEmployee}>Add</button>

      <h2>Employees</h2>
      <ul>
        {employees.length > 0 ? (
          employees.map((emp) => (
            <li key={emp._id}>
              {emp.name} ({emp.email}) – {emp.position}
            </li>
          ))
        ) : (
          <p>No employees found.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
