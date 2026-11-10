import React from "react";
import StatusBadge from "../common/StatusBadge";

function BookingStatus({ status }) {
  const messages = {
    pending: "Your booking is waiting for manager confirmation.",
    confirmed: "Your booking has been confirmed.",
    rejected: "The manager rejected this booking request.",
    cancelled: "This booking has been cancelled."
  };

  return (
    <div className="booking-status">
      <StatusBadge status={status} />
      <p>{messages[status] || "Booking status unavailable."}</p>
    </div>
  );
}

export default BookingStatus;