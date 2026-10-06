import React from "react";

function EventCard({ event }) {
  return (
    <div className="event-card">

      <span className="event-category">
        {event.category}
      </span>

      <h3>{event.name}</h3>

      <p>
        <strong>Date:</strong> {event.date}
      </p>

      <p>
        <strong>Venue:</strong> {event.venue}
      </p>

      <p className="seats">
        {event.seats} seats available
      </p>

      <a
        href={`/event/${event._id}`}
        className="button"
      >
        View Details
      </a>

    </div>
  );
}

export default EventCard;