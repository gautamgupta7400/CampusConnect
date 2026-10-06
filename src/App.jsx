import React from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyRegistrations from "./pages/MyRegistrations";

import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";


// ===============================
// Safe Local Storage User Parser
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


function App() {
  const path = window.location.pathname;


  // ===============================
  // Student Session
  // ===============================

  const studentToken =
    localStorage.getItem("studentToken");

  const studentUser =
    getUser("studentUser");

  const isStudent =
    !!studentToken &&
    studentUser?.role === "student";


  // ===============================
  // Admin Session
  // ===============================

  const adminToken =
    localStorage.getItem("adminToken");

  const adminUser =
    getUser("adminUser");

  const isAdmin =
    !!adminToken &&
    adminUser?.role === "admin";


  // ===============================
  // Admin Login
  // ===============================

  if (path === "/admin-login") {
    return <AdminLogin />;
  }


  // ===============================
  // Admin Panel
  // ===============================

  if (path === "/admin") {

    if (!isAdmin) {
      window.location.href = "/admin-login";
      return null;
    }

    return (
      <>
        <Navbar />
        <AdminPanel />
        <Footer />
      </>
    );
  }


  // ===============================
  // Student Signup
  // ===============================

  if (path === "/signup") {
    return <Signup />;
  }


  // ===============================
  // Student Login
  // ===============================

  if (path === "/login") {
    return <Login />;
  }


  // ===============================
  // Home
  // ===============================

  if (path === "/") {

    // Admin logged in
    if (isAdmin && !isStudent) {
      window.location.href = "/admin";
      return null;
    }

    return (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    );
  }


  // ===============================
  // Protected Student Pages
  // ===============================

  if (!isStudent) {
    window.location.href = "/login";
    return null;
  }


  // ===============================
  // Student Pages
  // ===============================

  let page = <Home />;

  if (path === "/events") {
    page = <Events />;
  }

  if (path.startsWith("/event/")) {
    page = <EventDetails />;
  }

  if (path === "/my-registrations") {
    page = <MyRegistrations />;
  }


  return (
    <>
      <Navbar />
      {page}
      <Footer />
    </>
  );
}

export default App;