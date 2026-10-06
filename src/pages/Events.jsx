import React, { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/events"
      );

      const data = await response.json();

      if (response.ok) {
        setEvents(data);
      } else {
        setMessage("Failed to load events");
      }
    } catch (error) {
      setMessage("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section">

      <div className="section-heading">
        <h1>All Events</h1>
      </div>

      {loading && <p>Loading events...</p>}

      {message && <p>{message}</p>}

      {!loading && events.length === 0 && (
        <p>No events available.</p>
      )}

      <div className="event-grid">
        {events.map((event) => (
          <div className="event-card" key={event._id}>

            <span className="event-category">
              {event.category}
            </span>

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

            <p className="seats">
  {event.availableSeats} seats available
</p>

            <a
              href={`/event/${event._id}`}
              className="button"
            >
              View Details
            </a>

          </div>
        ))}
      </div>

    </main>
  );
}

export default Events;