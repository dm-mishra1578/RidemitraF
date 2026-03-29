import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">

      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/logo.png" alt="logo" className="h-8" />
          <span className="text-xl font-bold text-blue-700">
            RideMitra
          </span>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-6 items-center font-medium">

          <Link to="/">Home</Link>

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {user && (
            <>
              {/* USER */}
              {user.role === "user" && (
                <>
                  <Link to="/services">Services</Link>
                  <Link to="/dashboard" className="text-blue-600">
                    Dashboard
                  </Link>
                </>
              )}

              {/* DRIVER */}
              {user.role === "driver" && (
                <Link to="/driver-dashboard">Driver Dashboard</Link>
              )}
              
              {/* ADMIN */}
              {user.role === "admin" && (
                <Link to="/admin-dashboard">Admin Dashboard</Link>
              )}

              {/* OWNER */}
              {user.role === "owner" && (
                <Link to="/owner-dashboard">Owner Dashboard</Link>
              )}

              <button onClick={logout} className="text-red-600">
                Logout
              </button>
            </>
          )}

        </ul>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">

          <Link to="/" onClick={() => setMenuOpen(false)} className="block p-3">
            Home
          </Link>

          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block p-3">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block p-3">
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              {user.role === "user" && (
                <>
                  <Link to="/services" onClick={() => setMenuOpen(false)} className="block p-3">
                    Services
                  </Link>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block p-3">
                    Dashboard
                  </Link>
                </>
              )}

              {user.role === "driver" && (
                <Link to="/driver-dashboard" onClick={() => setMenuOpen(false)} className="block p-3">
                  Driver Panel
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)} className="block p-3">
                  Admin Panel
                </Link>
              )}
              {user.role === "owner" && (
                <Link to="/owner-dashboard" onClick={() => setMenuOpen(false)} className="block p-3">
                  Owner Panel
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 text-red-600"
              >
                Logout
              </button>
            </>
          )}

        </div>
      )}
    </nav>
  );
}