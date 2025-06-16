import React from 'react';

function EventCard({ event }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold text-yellow-400">{event.title}</h3>
      <p className="text-gray-300">{event.description}</p>
      <p className="text-gray-400 mt-2">Date: {new Date(event.event_date).toLocaleDateString()}</p>
      <a
        href={event.source_url}
        className="text-yellow-400 mt-4 inline-block hover:text-yellow-500"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Details
      </a>
    </div>
  );
}

export default EventCard;
