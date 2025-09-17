import React, { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Use Render API in production, localhost only in dev
  const API_URL =
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://learnvest-erp.onrender.com/api"
      : "http://localhost:5000/api");

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      // save token + user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data._id); // ✅ keep id for worklogs

      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: res.data.token,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
