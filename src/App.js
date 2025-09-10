import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";

function App() {
  const [employees, setEmployees] = useState([]);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

  const API_URL = process.env.REACT_APP_API_URL; // should be like: https://learnvest-erp.onrender.com/api

  // restore session if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  const fetchEmployees = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/employees`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  };

  useEffect(() => {
    if (user) fetchEmployees();
  }, [user]);

  const addEmployee = () => {
    if (!name || !email || !position) return alert("All fields required!");
    const token = localStorage.getItem("token");
    axios
      .post(
        `${API_URL}/employees`,
        { name, email, position },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchEmployees();
        setName("");
        setEmail("");
        setPosition("");
      })
      .catch((err) => console.error("Error adding employee:", err));
  };

  if (!user) return <Login setUser={setUser} />;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Learnvest ERP</h1>
      <h2>Add Employee</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
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
