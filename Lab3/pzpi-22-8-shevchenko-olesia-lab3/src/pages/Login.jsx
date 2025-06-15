import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("username", username);
    form.append("password", password);

    const res = await fetch("http://localhost:8000/users/login", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userEmail", data.user.email);
      navigate("/dashboard");
    } else {
      alert("Login failed: " + (data.detail || "Unknown error"));
    }
  };

  return (
    <div className="flex items-center justify-center font-serif min-h-screen bg-black text-white">
      <div className="bg-zinc-900 p-10 rounded-xl shadow-md w-full max-w-md space-y-6">
        <h2 className="text-3xl font-serif font-semibold text-center">
          {t("login.title")}
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">{t("login.usernameLabel")}</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700"
              placeholder={t("login.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">{t("login.passwordLabel")}</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition"
          >
            {t("buttons.login")}
          </button>
        </form>

        <p className="text-sm text-center text-white/60">
          {t("login.forgot")}{" "}
          <Link to="/forgot-password" className="text-yellow-400 hover:underline">
            {t("login.reset")}
          </Link>
        </p>

        <p className="text-sm text-center text-white/60">
          {t("login.noAccount")}{" "}
          <Link to="/register" className="text-yellow-400 hover:underline">
            {t("buttons.signup")}
          </Link>
        </p>
      </div>
    </div>
  );
}
