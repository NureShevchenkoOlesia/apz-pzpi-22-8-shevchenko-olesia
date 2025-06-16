import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [observations, setObservations] = useState([]);
  const [subscribedEvents, setSubscribedEvents] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");
        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/users/me/observations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch observations");
        const data = await res.json();

        // Сортуємо за датою та залишаємо 2 найновіші
        const sorted = [...data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setObservations(sorted.slice(0, 2));
      } catch (err) {
        console.error("Error fetching observations:", err);
      }
    };

    fetchObservations();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8000/events/events");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Fetched events is not an array:", data);
          return;
        }

        if (user?.email) {
          const filtered = data.filter((event) =>
            event.subscribers?.includes(user.email)
          );
          setSubscribedEvents(filtered);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [user]);

  return (
    <div className="dashboard-container">
      {/* Спостереження */}
      <section className="dashboard-section">
        <h2 className="section-heading">Your Latest Observations</h2>
        {observations.length === 0 ? (
          <p className="empty-text">You have no observations yet.</p>
        ) : (
          <div className="observation-grid">
            {observations.map((obs, index) => (
              <div key={obs.id || index} className="observation-card">
                <img
                  src={obs.image_url}
                  alt={obs.title}
                  className="observation-image"
                />
                <h3 className="observation-title">{obs.title}</h3>
                <p className="observation-date">
                  Observed on {new Date(obs.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Підписані події */}
      <section>
        <h2 className="section-heading">Events You're Subscribed To</h2>
        {subscribedEvents.length === 0 ? (
          <p className="empty-text">You’re not subscribed to any events.</p>
        ) : (
          <ul className="event-list">
            {subscribedEvents.map((event, index) => (
              <li
                key={event.id || index}
                className="event-item"
              >
                <span>{event.title}</span>
                <span className="event-date">
                  {new Date(event.start_time).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
