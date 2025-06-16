import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <div className="font-serif text-white">
      <header className="font-serif flex justify-between items-center px-10 py-4 bg-black/90 backdrop-blur-md">
        <div className="flex items-center space-x-10">
          <img
            src="/photos/home/logo.svg"
            alt="Cosmorum Logo"
            className="h-8 w-auto"
          />
          <nav className="space-x-6 hidden md:flex text-sm font-medium text-white">
            <a href="/" className="hover:text-yellow-400 transition">Home</a>
            <a href="/search" className="hover:text-yellow-400 transition">Search</a>
            <a href="/gallery" className="hover:text-yellow-400 transition">Gallery</a>
            <a href="/astronomical-events" className="hover:text-yellow-400 transition">Events</a>
          </nav>
        </div>
        {token && <ProfileMenu />}
      </header>
    </div>
  );
}
