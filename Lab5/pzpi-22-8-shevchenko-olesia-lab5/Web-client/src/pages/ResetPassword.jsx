import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      alert("Password reset successfully.");
      navigate("/login");
    } else {
      alert("Reset failed.");
    }
  };

  if (!token) return <p className="text-white">Missing token.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white font-serif">
      <div className="bg-zinc-900 p-10 rounded-xl shadow-md w-full max-w-md space-y-6">
        <h2 className="text-3xl font-semibold text-center">Set New Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
