import React from 'react';
import { useTranslation } from 'react-i18next';

function EventCard({ event }) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold text-yellow-400">{event.title}</h3>
      <p className="text-gray-300">{event.description}</p>
      <p className="text-gray-400 mt-2">
        {t('event.date')}: {new Date(event.event_date).toLocaleDateString()}
      </p>
      <a
        href={event.source_url}
        className="text-yellow-400 mt-4 inline-block hover:text-yellow-500"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('event.viewDetails')}
      </a>
    </div>
  );
}

export default EventCard;
