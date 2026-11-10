import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="dashboard-shell">
      <Sidebar
        role={currentUser?.role}
        isOpen={sidebarOpen}
        onNavigate={closeSidebar}
      />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-mobile-controls">
          <button
            type="button"
            onClick={() => setSidebarOpen((previous) => !previous)}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? "Close menu" : "Open dashboard menu"}
          </button>
        </div>

        {sidebarOpen && (
          <button
            type="button"
            className="sidebar-mobile-overlay"
            aria-label="Close dashboard menu"
            onClick={closeSidebar}
          />
        )}

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;