import React from "react";

function AdminStats({ users = [], properties = [], bookings = [] }) {
  const pendingManagers = users.filter(
    (user) => user.role === "manager" && user.status === "pending"
  ).length;

  const pendingProperties = properties.filter(
    (property) => property.status === "pending"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length
    },
    {
      label: "Pending Managers",
      value: pendingManagers
    },
    {
      label: "Total Properties",
      value: properties.length
    },
    {
      label: "Pending Properties",
      value: pendingProperties
    },
    {
      label: "Total Bookings",
      value: bookings.length
    },
    {
      label: "Pending Bookings",
      value: pendingBookings
    }
  ];

  return (
    <div className="admin-stats-grid">
      {stats.map((stat) => (
        <div className="admin-stat-card" key={stat.label}>
          <h3>{stat.label}</h3>
          <p>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminStats;
