import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/dashboard">TaskFlow</Link>

      <button className="mobile-menu" onClick={() => setOpen((v) => !v)}>
        ☰
      </button>

      <nav className={open ? "nav-links open" : "nav-links"}>
        <span className="welcome">Hi, {user?.name}</span>
        <button className="icon-btn" onClick={() => setDarkMode((v) => !v)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}
