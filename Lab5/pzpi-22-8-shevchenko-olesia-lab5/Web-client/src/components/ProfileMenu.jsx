import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid"; 

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center hover:bg-yellow-200 transition"
      >
        <StarIcon className="w-6 h-6" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-black rounded-lg shadow-lg w-48 py-2 z-50 border border-white/10">
          <button
            onClick={() => navigate("/profile")}
            className="block w-full text-left px-4 py-2 text-sm text-white bg-black hover:bg-white/10 transition"
          >
            My Profile
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="block w-full text-left px-4 py-2 text-sm text-white bg-black hover:bg-white/10 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/astronomical-events")}
            className="block w-full text-left px-4 py-2 text-sm text-white bg-black hover:bg-white/10 transition"
          >
            Upcoming events
          </button>
          <button
            onClick={() => navigate("/edit-profile")}
            className="block w-full text-left px-4 py-2 text-sm text-white bg-black hover:bg-white/10 transition"
          >
            Settings
          </button>
          <div className="border-t border-white/10 my-2"></div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 bg-black hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
