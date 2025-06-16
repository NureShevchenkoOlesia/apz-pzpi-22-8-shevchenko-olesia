import React, { useState } from 'react';

function SubscribeEventForm({ eventId }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async () => {
    const response = await fetch(`http://localhost:8000/astronomical-events/${eventId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setIsSubscribed(true);
    } else {
      alert('Failed to subscribe');
    }
  };

  return (
    <div className="mt-4">
      {!isSubscribed ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg text-black"
          />
          <button
            onClick={handleSubscribe}
            className="ml-4 bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300"
          >
            Subscribe
          </button>
        </>
      ) : (
        <p className="text-green-400">You are subscribed to this event!</p>
      )}
    </div>
  );
}

export default SubscribeEventForm;
