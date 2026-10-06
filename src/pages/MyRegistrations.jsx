import React, { useEffect, useState } from "react";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    const token = localStorage.getItem("studentToken");

    if (!token) {
      setMessage("Please login first");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/registrations/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log("My Registrations:", data);

      if (response.ok) {
        setRegistrations(data);
      } else {
        setMessage(data.message || "Failed to load registrations");
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
        <div className="section-heading">
          <h1>My Registrations</h1>
          <p>Loading registrations...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="section">

      <div className="section-heading">
        <h1>My Registrations</h1>
        <p>Events you have registered for</p>
      </div>

      {message && (
        <p>{message}</p>
      )}

      {!message && registrations.length === 0 && (
        <p>
          You have not registered for any event yet.
        </p>
      )}

      <div>
        {registrations.map((registration) => (

          <div
            className="registration-card"
            key={registration._id}
          >

            <h3>
              {registration.eventId?.name || "Event"}
            </h3>

            <p>
              <strong>Date:</strong>{" "}
              {registration.eventId?.date || "N/A"}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {registration.eventId?.time || "N/A"}
            </p>

            <p>
              <strong>Venue:</strong>{" "}
              {registration.eventId?.venue || "N/A"}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {registration.eventId?.category || "N/A"}
            </p>

            <span className="status">
              Registered
            </span>

          </div>

        ))}
      </div>

    </main>
  );
}

export default MyRegistrations;