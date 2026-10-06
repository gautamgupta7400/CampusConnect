import React, { useState } from "react";

function Login() {
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

      // Student only
      if (data.user.role !== "student") {
        setMessage("Please use Admin Login for admin account.");
        return;
      }

      // Student session
      localStorage.setItem("studentToken", data.token);
      localStorage.setItem(
        "studentUser",
        JSON.stringify(data.user)
      );

      // Go directly to student home
      window.location.href = "/";

    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>Student Login</h1>

        <p>Login to CampusConnect</p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="button"
          >
            Login
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

export default Login;