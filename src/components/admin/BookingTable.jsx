import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const BookingTable = ({ bookings }) => {
  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings found"
        message="No bookings match the selected filters."
      />
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Property</th>
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>#{booking.id}</td>

              <td>{booking.customerName || "Unknown"}</td>

              <td>{booking.propertyName || "Unknown"}</td>

              <td>{booking.roomName || "Unknown"}</td>

              <td>{formatDate(booking.checkIn)}</td>

              <td>{formatDate(booking.checkOut)}</td>

              <td>{formatCurrency(booking.total || 0)}</td>

              <td>
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;