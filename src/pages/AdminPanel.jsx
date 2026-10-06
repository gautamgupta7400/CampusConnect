import React, { useEffect, useState } from "react";

function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [showStudents, setShowStudents] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);

  const [message, setMessage] = useState("");

  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    description: "",
    seats: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

const user = JSON.parse(
  localStorage.getItem("adminUser") || "null"
);

    if (!token || !user || user.role !== "admin") {
      window.location.href = "/admin-login";
    }
  }, []);

  // Get Students
  const fetchStudents = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/students",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudents(data);
        setShowStudents(true);
        setShowEvents(false);
        setShowAddEvent(false);
        setShowRegistrations(false);
        setMessage("");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  // Delete Student
  const deleteStudent = async (studentId) => {
    const token = localStorage.getItem("adminToken");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/students/${studentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudents(
          students.filter((student) => student._id !== studentId)
        );

        setMessage("Student deleted successfully!");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  // Get Events
  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/events"
      );

      const data = await response.json();

      if (response.ok) {
        setEvents(data);
        setShowEvents(true);
        setShowStudents(false);
        setShowAddEvent(false);
        setShowRegistrations(false);
        setMessage("");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  // Delete Event
  const deleteEvent = async (eventId) => {
    const token = localStorage.getItem("adminToken");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEvents(
          events.filter((event) => event._id !== eventId)
        );

        setMessage("Event deleted successfully!");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  // Handle Event Input
  const handleEventChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };

  // Add Event
  const addEvent = async (e) => {
    e.preventDefault();

   const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...eventData,
            seats: Number(eventData.seats)
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Event added successfully!");

        setEventData({
          name: "",
          date: "",
          time: "",
          venue: "",
          category: "",
          description: "",
          seats: ""
        });

        setShowAddEvent(false);

        fetchEvents();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  // Get Registrations
  const fetchRegistrations = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        "http://localhost:5000/api/registrations/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRegistrations(data);
        setShowRegistrations(true);
        setShowStudents(false);
        setShowEvents(false);
        setShowAddEvent(false);
        setMessage("");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  return (
    <main className="section">

      <div className="section-heading">
        <h1>Admin Panel</h1>
        <p>Manage CampusConnect</p>
      </div>

      {/* Admin Options */}

      <div className="event-grid">

        <div className="event-card">
          <h3>Students</h3>

          <p>
            View and manage student accounts.
          </p>

          <button
            className="button"
            onClick={fetchStudents}
          >
            View Students
          </button>
        </div>

        <div className="event-card">
          <h3>Events</h3>

          <p>
            Add and delete college events.
          </p>

          <button
            className="button"
            onClick={fetchEvents}
          >
            Manage Events
          </button>
        </div>

        <div className="event-card">
          <h3>Add Event</h3>

          <p>
            Create a new college event.
          </p>

          <button
            className="button"
            onClick={() => {
              setShowAddEvent(true);
              setShowStudents(false);
              setShowEvents(false);
              setShowRegistrations(false);
              setMessage("");
            }}
          >
            Add New Event
          </button>
        </div>

        <div className="event-card">
          <h3>Registrations</h3>

          <p>
            View student event registrations.
          </p>

          <button
            className="button"
            onClick={fetchRegistrations}
          >
            View Registrations
          </button>
        </div>

      </div>

      {/* Message */}

      {message && (
        <p style={{ marginTop: "20px" }}>
          {message}
        </p>
      )}

      {/* Add Event Form */}

      {showAddEvent && (
        <div className="auth-card" style={{ marginTop: "30px" }}>

          <h2>Add New Event</h2>

          <form onSubmit={addEvent}>

            <label>Event Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter event name"
              value={eventData.name}
              onChange={handleEventChange}
              required
            />

            <label>Date</label>

            <input
              type="text"
              name="date"
              placeholder="Example: 20 October 2026"
              value={eventData.date}
              onChange={handleEventChange}
              required
            />

            <label>Time</label>

            <input
              type="text"
              name="time"
              placeholder="Example: 10:00 AM"
              value={eventData.time}
              onChange={handleEventChange}
              required
            />

            <label>Venue</label>

            <input
              type="text"
              name="venue"
              placeholder="Enter venue"
              value={eventData.venue}
              onChange={handleEventChange}
              required
            />

            <label>Category</label>

            <input
              type="text"
              name="category"
              placeholder="Example: Technical"
              value={eventData.category}
              onChange={handleEventChange}
              required
            />

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter event description"
              value={eventData.description}
              onChange={handleEventChange}
              required
            />

            <label>Seats</label>

            <input
              type="number"
              name="seats"
              placeholder="Enter number of seats"
              value={eventData.seats}
              onChange={handleEventChange}
              required
            />

            <button
              type="submit"
              className="button"
            >
              Add Event
            </button>

          </form>

        </div>
      )}

      {/* Students */}

      {showStudents && (
        <div style={{ marginTop: "30px" }}>

          <h2>Student Accounts</h2>

          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            students.map((student) => (

              <div
                className="event-card"
                key={student._id}
                style={{ marginTop: "15px" }}
              >

                <h3>{student.name}</h3>

                <p>
                  <strong>Roll No:</strong> {student.rollNo}
                </p>

                <p>
                  <strong>Email:</strong> {student.email}
                </p>

                <p>
                  <strong>Role:</strong> {student.role}
                </p>

                <button
                  className="button"
                  onClick={() => deleteStudent(student._id)}
                >
                  Delete Student
                </button>

              </div>

            ))
          )}

        </div>
      )}

      {/* Events */}

      {showEvents && (
        <div style={{ marginTop: "30px" }}>

          <h2>Event Management</h2>

          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            events.map((event) => (

              <div
                className="event-card"
                key={event._id}
                style={{ marginTop: "15px" }}
              >

                <h3>{event.name}</h3>

                <p>
                  <strong>Date:</strong> {event.date}
                </p>

                <p>
                  <strong>Time:</strong> {event.time}
                </p>

                <p>
                  <strong>Venue:</strong> {event.venue}
                </p>

                <p>
                  <strong>Category:</strong> {event.category}
                </p>

               <p>
  <strong>Total Seats:</strong> {event.totalSeats}
</p>

<p>
  <strong>Registered Students:</strong> {event.registeredCount}
</p>

<p>
  <strong>Seats Available:</strong> {event.availableSeats}
</p>

                <button
                  className="button"
                  onClick={() => deleteEvent(event._id)}
                >
                  Delete Event
                </button>

              </div>

            ))
          )}

        </div>
      )}

      {/* Registrations */}

      {showRegistrations && (
        <div style={{ marginTop: "30px" }}>

          <h2>Event Registrations</h2>

          {registrations.length === 0 ? (
            <p>No registrations found.</p>
          ) : (
            registrations.map((registration) => (

              <div
                className="event-card"
                key={registration._id}
                style={{ marginTop: "15px" }}
              >

                <h3>
                  {registration.userId?.name}
                </h3>

                <p>
                  <strong>Roll No:</strong>{" "}
                  {registration.userId?.rollNo}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {registration.userId?.email}
                </p>

                <p>
                  <strong>Event:</strong>{" "}
                  {registration.eventId?.name}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {registration.eventId?.date}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {registration.eventId?.time}
                </p>

                <p>
                  <strong>Venue:</strong>{" "}
                  {registration.eventId?.venue}
                </p>

              </div>

            ))
          )}

        </div>
      )}

    </main>
  );
}

export default AdminPanel;