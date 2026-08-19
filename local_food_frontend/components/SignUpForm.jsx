import React, { useState } from "react";
import axios from "axios";
import "../src/assets/styles/Forms.css";

function SignupForm({ onAuthSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "buyer", // default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    axios.post("http://127.0.0.1:8000/api/signup/", formData, {
      withCredentials: true,
    })
      .then((response) => {
        alert("Signup successful!");
        onAuthSuccess(response.data);
        setFormData({
          username: "",
          email: "",
          password: "",
          password2: "",
          role: "buyer",
        });
      })
      .catch((error) => {
        console.error("Signup error:", error);
        const errors = error.response?.data?.errors;
        const message = errors
          ? Object.values(errors).flat().join(" ")
          : error.response?.data?.error ||
            "Could not create the account. Make sure Django is running.";
        setError(message);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Sign Up</h2>
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
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
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
      <input
        type="password"
        name="password2"
        placeholder="Confirm password"
        value={formData.password2}
        onChange={handleChange}
        required
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      >
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
      {error && <p style={{ color: "#b00020", marginTop: "10px" }}>{error}</p>}
      <button type="submit" style={{ padding: "10px 15px", marginTop: "10px" }}>
        Sign Up
      </button>
    </form>
  );
}

export default SignupForm;
