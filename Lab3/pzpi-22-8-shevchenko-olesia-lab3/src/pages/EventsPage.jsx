import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followingEvents, setFollowingEvents] = useState({});
  const [filterType, setFilterType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8000/events/events");
        const data = await res.json();
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.start_time || a.event_date || 0);
          const dateB = new Date(b.start_time || b.event_date || 0);
          return dateB - dateA;
        });
        setEvents(sorted);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const subscribeToEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    try {
      const res = await fetch("http://localhost:8000/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_ids: [eventId],
        }),
      });
      if (res.ok) {
        setFollowingEvents((prev) => ({
          ...prev,
          [eventId]: true,
        }));
        alert("The subscription is successful. The email is sent.");
      } else {
        const errorText = await res.text();
        console.log("Subscription failed:", errorText);
        alert("Subscription error.");
      }
    } catch (error) {
      console.error("Error during subscription:", error);
    }
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.start_time || event.event_date);
    const matchType = filterType === "All" || event.type === filterType;
    const matchStart = startDate ? eventDate >= new Date(startDate) : true;
    const matchEnd = endDate ? eventDate <= new Date(endDate) : true;
    return matchType && matchStart && matchEnd;
  });

  return (
    <div className="events-container">
      <h2 className="events-title">{t("events.title")}</h2>

      <div className="events-filter-bar">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="events-select">
          <option value="All">{t("events.filter.all")}</option>
          <option value="FLR">{t("events.filter.flr")}</option>
          <option value="GST">{t("events.filter.gst")}</option>
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="events-date" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="events-date" />
        <button
          onClick={() => {
            setFilterType("All");
            setStartDate("");
            setEndDate("");
          }}
          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
        >
          {t("events.clear")}
        </button>
      </div>

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="bg-zinc-900 rounded-lg p-5 shadow-md hover:shadow-xl transition cursor-pointer"
            onClick={() => openModal(event)}
          >
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-white/70 mb-2">
              {new Date(event.start_time || event.event_date).toLocaleDateString()}
            </p>
            <p className="text-sm text-white/50 line-clamp-3">
              {event.type === "FLR" ? (
                <span>{t("events.class")}: {event.class_type}</span>
              ) : (
                event.kp_index?.map((entry, idx) => (
                  <span key={idx}>
                    {new Date(entry.observedTime).toLocaleDateString()}: KpIndex {entry.kp_index}{" "}
                  </span>
                ))
              )}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                subscribeToEvent(event._id);
              }}
              className="mt-3 text-sm text-yellow-400 hover:underline"
            >
              {followingEvents[event._id] ? t("events.following") : t("events.follow")}
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedEvent && (
        <div className="event-modal-backdrop" onClick={closeModal}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
            <p className="text-white/60 mb-2">
              {new Date(selectedEvent.start_time || selectedEvent.event_date).toLocaleString()}
            </p>
            <p className="text-white/70 mb-4">
              {selectedEvent.type === "FLR" ? (
                <span>{t("events.class")}: {selectedEvent.class_type}</span>
              ) : (
                selectedEvent.kp_index?.map((entry, idx) => (
                  <div key={idx}>
                    <p>
                      {new Date(entry.observedTime).toLocaleString()} - KpIndex: {entry.kp_index}
                    </p>
                  </div>
                ))
              )}
            </p>
            <a
              href={selectedEvent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 underline hover:text-yellow-500"
            >
              {t("events.moreInfo")}
            </a>
            <div className="mt-6">
              <button
                onClick={closeModal}
                className="w-full mt-4 px-6 py-2 border-white text-white rounded-lg hover:bg-yellow-600 transition"
              >
                {t("events.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
