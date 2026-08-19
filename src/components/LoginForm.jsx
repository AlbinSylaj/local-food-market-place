import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Forms.css";

function LoginForm({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    axios.post("http://127.0.0.1:8000/api/login/", formData, {
      withCredentials: true,
    })
      .then((response) => {
        onAuthSuccess(response.data);
        setFormData({ username: "", password: "" });
        navigate("/");
      })
      .catch((error) => {
        setError(
          error.response?.data?.error ||
          "Could not log in. Make sure Django is running."
        );
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      {error && <p style={{ color: "#b00020", marginTop: "10px" }}>{error}</p>}
      <button type="submit" style={{ padding: "10px 15px", marginTop: "10px" }}>
        Login
      </button>
    </form>
  );
}

export default LoginForm;