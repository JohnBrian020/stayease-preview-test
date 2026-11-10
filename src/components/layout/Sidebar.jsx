import React from "react";
import { NavLink } from "react-router-dom";

const navigation = {
  admin: [
    { label: "Overview", path: "/admin/dashboard", icon: "▦" },
    { label: "Managers", path: "/admin/managers", icon: "♙" },
    { label: "Properties", path: "/admin/properties", icon: "⌂" },
    { label: "Bookings", path: "/admin/bookings", icon: "▤" }
  ],

  manager: [
    { label: "Overview", path: "/manager/dashboard", icon: "▦" },
    { label: "My properties", path: "/manager/properties", icon: "⌂" },
    { label: "Add property", path: "/manager/properties/new", icon: "+" },
    { label: "Bookings", path: "/manager/bookings", icon: "▤" }
  ],

  customer: [
    { label: "Overview", path: "/customer/dashboard", icon: "▦" },
    { label: "Browse stays", path: "/properties", icon: "⌂" },
    { label: "My bookings", path: "/customer/bookings", icon: "▤" }
  ]
};

function Sidebar({
  role,
  isOpen = false,
  onNavigate
}) {
  const links = navigation[role] || [];

  return (
    <aside
      className={`dashboard-sidebar ${isOpen ? "sidebar-open" : ""}`}
    >
      <div className="sidebar-heading">
        <span className="sidebar-heading-symbol">S</span>
        <span>StayEase</span>
      </div>

      <p className="sidebar-label">
        {role} workspace
      </p>

      <nav className="sidebar-nav">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={onNavigate}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <p>StayEase Phase 1</p>
      </div>
    </aside>
  );
}

export default Sidebar;