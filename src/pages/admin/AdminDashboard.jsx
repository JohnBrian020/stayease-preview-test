import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

import AdminStats from "../../components/admin/AdminStats";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminDashboard = () => {
  const { users, loading: authLoading, error: authError } = useAuth();

  const {
    properties,
    bookings,
    loading: bookingLoading,
    error: bookingError,
  } = useBookings();

  const managers = users.filter((user) => user.role === "manager");

  if (authLoading || bookingLoading) {
    return <Loading />;
  }

  const error = authError || bookingError;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-eyebrow">STAYEASE ADMINISTRATION</p>
          <h1>Admin Dashboard</h1>
          <p>Monitor and manage the StayEase platform.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <section className="admin-section">
        <h2>Platform Overview</h2>

        <AdminStats
          managers={managers}
          properties={properties}
          bookings={bookings}
        />
      </section>

      <section className="admin-section">
        <h2>Management</h2>

        <div className="admin-quick-links">
          <Link to="/admin/managers" className="admin-quick-link">
            <div>
              <h3>Manager Approvals</h3>
              <p>
                Review and approve property manager registrations.
              </p>
            </div>

            <span>→</span>
          </Link>

          <Link to="/admin/properties" className="admin-quick-link">
            <div>
              <h3>Property Approvals</h3>
              <p>
                Review properties submitted by managers.
              </p>
            </div>

            <span>→</span>
          </Link>

          <Link to="/admin/bookings" className="admin-quick-link">
            <div>
              <h3>Booking Management</h3>
              <p>
                View customer reservations and booking statuses.
              </p>
            </div>

            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Recent Bookings</h2>

          <Link to="/admin/bookings">View all bookings</Link>
        </div>

        {bookings.length === 0 ? (
          <p className="admin-muted">No bookings have been made yet.</p>
        ) : (
          <div className="recent-bookings-list">
            {bookings.slice(0, 5).map((booking) => (
              <div className="recent-booking-item" key={booking.id}>
                <div>
                  <strong>{booking.customerName || "Customer"}</strong>
                  <p>{booking.propertyName || "Property"}</p>
                </div>

                <span className="recent-booking-status">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;