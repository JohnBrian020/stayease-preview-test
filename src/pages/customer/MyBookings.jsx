import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import BookingCard from "../../components/booking/BookingCard";

const MyBookings = () => {
  const { currentUser } = useAuth();
  const { bookings = [], loading, error, cancelBooking } = useBookings();

  const [statusFilter, setStatusFilter] = useState("all");
  const [actionError, setActionError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const myBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        String(booking.customerId) === String(currentUser?.id)
    );
  }, [bookings, currentUser?.id]);

  const filteredBookings = myBookings.filter(
    (booking) =>
      statusFilter === "all" || booking.status === statusFilter
  );

  const handleCancel = async (booking) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setActionError("");
    setCancellingId(booking.id);

    try {
      const result = await cancelBooking(booking.id, currentUser.id);

      if (result?.success === false) {
        setActionError(result.error || "Unable to cancel this booking.");
      }
    } catch (err) {
      setActionError(err.message || "Unable to cancel this booking.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <Loading message="Loading your bookings..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main className="customer-page">
      <header className="customer-page-header">
        <div>
          <h1>My bookings</h1>
          <p>View and manage your accommodation reservations.</p>
        </div>

        <Link to="/properties" className="btn btn-primary">
          Find accommodation
        </Link>
      </header>

      <section className="customer-booking-filter">
        <label htmlFor="booking-status-filter">Filter bookings</label>

        <select
          id="booking-status-filter"
          className="input-field"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </section>

      {actionError && (
        <div className="error-message" role="alert">
          {actionError}
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          message={
            myBookings.length === 0
              ? "You have not made any reservations yet."
              : "There are no bookings with the selected status."
          }
        />
      ) : (
        <section className="customer-booking-list">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={() => handleCancel(booking)}
              cancelling={cancellingId === booking.id}
              detailsPath={`/customer/bookings/${booking.id}`}
            />
          ))}
        </section>
      )}
    </main>
  );
};

export default MyBookings;