import React from "react";

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "unknown")
    .toLowerCase()
    .replaceAll(" ", "-");

  const labels = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
    confirmed: "Confirmed",
    cancelled: "Cancelled"
  };

  return (
    <span className={`status-badge status-${normalizedStatus}`}>
      {labels[normalizedStatus] || normalizedStatus}
    </span>
  );
}

export default StatusBadge;