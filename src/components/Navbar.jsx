import React from "react";


// ===============================
// Safe User Parser
// ===============================

function getUser(key) {
  try {
    const user = localStorage.getItem(key);

    if (!user || user === "undefined") {
      return null;
    }

    return JSON.parse(user);

  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
}


function Navbar() {

  // Student
  const studentToken =
    localStorage.getItem("studentToken");

  const studentUser =
    getUser("studentUser");


  // Admin
  const adminToken =
    localStorage.getItem("adminToken");

  const adminUser =
    getUser("adminUser");


  const isStudent =
    !!studentToken &&
    studentUser?.role === "student";


  const isAdmin =
    !!adminToken &&
    adminUser?.role === "admin";


  const isAdminPage =
    window.location.pathname === "/admin";


  // ===============================
  // Student Logout
  // ===============================

  const handleStudentLogout = () => {

    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentUser");

    window.location.href = "/login";
  };


  // ===============================
  // Admin Logout
  // ===============================

  const handleAdminLogout = () => {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "/admin-login";
  };


  return (
    <nav className="navbar">

      <a
        href={isAdminPage ? "/admin" : "/"}
        className="logo"
      >
        CampusConnect
      </a>


      <div className="nav-links">


        {/* =========================
            STUDENT NAVBAR
        ========================= */}

        {isStudent && !isAdminPage && (
          <>
            <a href="/">
              Home
            </a>

            <a href="/events">
              Events
            </a>

            <a href="/my-registrations">
              My Registrations
            </a>

            <button
              className="login-link"
              onClick={handleStudentLogout}
            >
              Logout
            </button>
          </>
        )}


        {/* =========================
            ADMIN NAVBAR
        ========================= */}

        {isAdmin && isAdminPage && (
          <>
            <a href="/admin">
              Admin Panel
            </a>

            <button
              className="login-link"
              onClick={handleAdminLogout}
            >
              Logout
            </button>
          </>
        )}


        {/* =========================
            LOGGED OUT NAVBAR
        ========================= */}

        {!isStudent && !isAdmin && (
          <>
            <a href="/login">
              Student Login
            </a>

            <a href="/signup">
              Sign Up
            </a>

            <a href="/admin-login">
              Admin Login
            </a>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;