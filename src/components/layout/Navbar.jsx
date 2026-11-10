import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login");
  }

  const dashboardPath = currentUser
    ? `/${currentUser.role}/dashboard`
    : "/login";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="navbar-brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-symbol">S</span>
          <span>StayEase</span>
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/properties"
            onClick={() => setMenuOpen(false)}
          >
            Browse stays
          </NavLink>

          {currentUser?.role === "customer" && (
            <NavLink
              to="/customer/bookings"
              onClick={() => setMenuOpen(false)}
            >
              My bookings
            </NavLink>
          )}

          {currentUser ? (
            <div className="navbar-account">
              <Link
                to={dashboardPath}
                className="navbar-user"
                onClick={() => setMenuOpen(false)}
              >
                {currentUser.name}
              </Link>

              <Button
                variant="outline"
                size="small"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          ) : (
            <div className="navbar-account">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="navbar-register"
                onClick={() => setMenuOpen(false)}
              >
                Create account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;