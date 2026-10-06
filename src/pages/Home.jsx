import React, { useEffect, useState } from "react";

import EventCard from "../components/EventCard";

function Home() {
  const [events, setEvents] = useState([]);

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
      }
    } catch (error) {
      console.log("Failed to load events");
    }
  };

  return (
    <main>

      <section className="hero">
        <h1>College Events, All in One Place.</h1>

        <p>
          Discover upcoming college events and register easily.
        </p>

        <a className="button" href="/events">
          Explore Events
        </a>
      </section>

      <section className="section">

        <div className="section-heading">
          <h2>Upcoming Events</h2>

          <a href="/events">
            View all
          </a>
        </div>

        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))}
          </div>
        )}

      </section>

    </main>
  );
}

export default Home;