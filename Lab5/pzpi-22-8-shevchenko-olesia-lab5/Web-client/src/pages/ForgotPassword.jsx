import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2 className="forgot-title">Reset Password</h2>
        {submitted ? (
          <p className="forgot-success">Check your email for reset link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div>
              <label className="forgot-label">Email</label>
              <input
                type="email"
                className="forgot-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="forgot-button">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );  
}
