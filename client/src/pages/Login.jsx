import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
  const response = await api.post("/users/login", formData);
  console.log("✅ Login response:", response);
  localStorage.setItem("token", response.data.token);
  // store user info locally for UI display
  if (response.data.user) localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("✅ Login successful!");
      onLoginSuccess();
      navigate("/");
    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Invalid credentials";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
