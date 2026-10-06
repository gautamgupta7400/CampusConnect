import React, { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      // Save student token
      localStorage.setItem(
        "studentToken",
        data.token
      );

      // Save student information
      localStorage.setItem(
        "studentUser",
        JSON.stringify(data.user)
      );

      // Go directly to Home
      window.location.href = "/";

    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>Student Sign Up</h1>

        <p>
          Create your CampusConnect account
        </p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Roll Number</label>

          <input
            type="text"
            name="rollNo"
            placeholder="Enter your roll number"
            value={formData.rollNo}
            onChange={handleChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="button"
          >
            Sign Up
          </button>

        </form>

        {message && (
          <p style={{ marginTop: "15px" }}>
            {message}
          </p>
        )}

        <p className="auth-footer">
          Already have an account?
          <a href="/login"> Login</a>
        </p>

      </div>

    </main>
  );
}

export default Signup;