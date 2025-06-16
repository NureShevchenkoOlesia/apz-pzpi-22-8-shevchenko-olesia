import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert("Registration failed: " + errorData.detail);
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
      console.error("Error:", error);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-black font-serif text-white">
      {/* Form */}
      <div className="p-10 flex flex-col items-center justify-center w-full max-w-md">
        <h3 className="text-3xl font-serif font-semibold mb-6 text-center">Create your account</h3>
        <form onSubmit={handleRegister} className="space-y-5 w-full">
          <div>
            <label className="block mb-1 text-sm text-white/70">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur-md focus:outline-none"
              placeholder="Your username"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-white/70">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur-md focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-white/70">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur-md focus:outline-none"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-white text-black rounded-lg font-medium shadow-md hover:bg-gray-200 transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-white/60 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-400 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}