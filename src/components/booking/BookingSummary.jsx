import React from "react";

import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function BookingSummary({ booking }) {
  return (
    <div className="booking-summary">
      <div className="booking-summary-header">
        <h3>Booking summary</h3>
        <strong>#{booking.id}</strong>
      </div>

      <div className="booking-summary-details">
        <div>
          <span>Property</span>
          <strong>{booking.propertyName}</strong>
        </div>

        <div>
          <span>Room</span>
          <strong>{booking.roomName}</strong>
        </div>

        <div>
          <span>Check-in</span>
          <strong>{formatDate(booking.checkIn)}</strong>
        </div>

        <div>
          <span>Check-out</span>
          <strong>{formatDate(booking.checkOut)}</strong>
        </div>

        <div>
          <span>Guests</span>
          <strong>{booking.guests}</strong>
        </div>

        <div>
          <span>Duration</span>
          <strong>{booking.nights} nights</strong>
        </div>

        <div className="booking-summary-total">
          <span>Total price</span>
          <strong>{formatCurrency(booking.total)}</strong>
        </div>
      </div>
    </div>
  );
}

export default BookingSummary;