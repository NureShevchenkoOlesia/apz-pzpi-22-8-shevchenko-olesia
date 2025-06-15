import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

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
        <h2 className="forgot-title">{t("forgot.title")}</h2>
        {submitted ? (
          <p className="forgot-success">{t("forgot.success")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div>
              <label className="forgot-label">{t("forgot.emailLabel")}</label>
              <input
                type="email"
                className="forgot-input"
                placeholder={t("forgot.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="forgot-button">
              {t("forgot.button")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
