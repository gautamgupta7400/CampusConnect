import React, { useState } from "react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      // Only admin can use Admin Login
      if (data.user.role !== "admin") {
        setMessage("Admin access required");
        return;
      }

      // Admin session
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.user)
      );

      // Automatically go to Admin Panel
      window.location.href = "/admin";

    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>Admin Login</h1>

        <p>Login to manage CampusConnect</p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="button"
          >
            Login as Admin
          </button>

        </form>

        {message && (
          <p style={{ marginTop: "15px" }}>
            {message}
          </p>
        )}

      </div>

    </main>
  );
}

export default AdminLogin;