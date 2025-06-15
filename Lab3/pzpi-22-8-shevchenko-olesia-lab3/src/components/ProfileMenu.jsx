import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid"; 
import { useTranslation } from "react-i18next";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("profileMenu.deleteAccount") + "?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
            {t('profileMenu.myProfile')}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="block w-full text-left px-4 py-2 text-sm text-white bg-black hover:bg-white/10 transition"
          >
            {t('profileMenu.dashboard')}
          </button>
          <button
            onClick={() => navigate("/upload")}
            className="block w-full text-left px-4 py-2 text-sm text-white bg-black hover:bg-white/10 transition"
          >
            {t('profileMenu.newObservation')}
          </button>
          <button
            onClick={() => navigate("/edit-profile")}
            className="block w-full text-left px-4 py-2 text-sm text-white bg-black hover:bg-white/10 transition"
          >
            {t('profileMenu.settings')}
          </button>
          <div className="border-t border-white/10 my-2"></div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 bg-black hover:bg-red-500 hover:text-white transition"
          >
            {t('profileMenu.logout')}
          </button>
          <button
            onClick={handleDeleteAccount}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 bg-black hover:bg-red-600 hover:text-white transition"
          >
            {t("profileMenu.deleteAccount")}
          </button>
        </div>
      )}
    </div>
  );
}
