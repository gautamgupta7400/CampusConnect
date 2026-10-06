import React, { useEffect, useState } from "react";

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
  const token = localStorage.getItem("studentToken");

  if (!token) {
    setMessage("Please login first");
    return;
  }

  const eventId = window.location.pathname.split("/")[2];

  try {
    const response = await fetch(
      `http://localhost:5000/api/registrations/${eventId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      setMessage("Event registration successful!");
    } else {
      setMessage(data.message);
    }

  } catch (error) {
    setMessage("Server connection failed");
  }
};

  useEffect(() => {
    const eventId = window.location.pathname.split("/")[2];

    fetchEvent(eventId);
  }, []);

  const fetchEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`
      );

      const data = await response.json();

      if (response.ok) {
        setEvent(data);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="section">
        <p>Loading event...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="section">
        <p>{message || "Event not found"}</p>
      </main>
    );
  }

  return (
    <main className="section">

      <div className="details-card">

        <span className="event-category">
          {event.category}
        </span>

        <h1>{event.name}</h1>

        <div className="details-list">

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
            <strong>Seats:</strong> {event.seats} available
          </p>

        </div>

        <h3>About the Event</h3>

        <p>
          {event.description}
        </p>

          <button
           className="button"
           onClick={handleRegister}
          >
          Register for Event
        </button>

        
        {message && (
        <p style={{ marginTop: "15px" }}>
         {message}
       </p>
      )}
      </div>

    </main>
  );
}

export default EventDetails;