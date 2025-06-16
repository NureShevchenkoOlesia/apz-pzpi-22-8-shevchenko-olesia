import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
        <h2 className="text-3xl font-serif font-semibold text-center">Welcome back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Username</label>
            <input
              type="username"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700"
              placeholder="your name <3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-center text-white/60">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-yellow-400 hover:underline">
            Reset it
          </Link>
        </p>
        <p className="text-sm text-center text-yellow/60">
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
