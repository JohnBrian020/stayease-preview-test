
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>StayEase</h3>
          <p>Find comfortable places to stay, wherever life takes you.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/properties">Browse Properties</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} StayEase. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
