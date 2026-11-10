import { useMemo, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

import BookingTable from "../../components/admin/BookingTable";
import AdminPagination from "../../components/admin/AdminPagination";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";

const ITEMS_PER_PAGE = 8;

const ManagerBookings = () => {
  const { currentUser } = useAuth();

  const {
    properties,
    bookings,
    updateBookingStatus,
    loading,
    error,
  } = useBookings();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const myPropertyIds = properties
    .filter((property) => property.managerId === currentUser.id)
    .map((property) => property.id);

  const myBookings = bookings.filter((booking) =>
    myPropertyIds.some(
      (propertyId) => String(propertyId) === String(booking.propertyId)
    )
  );

  const filteredBookings = useMemo(() => {
    return myBookings.filter((booking) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        booking.customerName?.toLowerCase().includes(searchValue) ||
        booking.propertyName?.toLowerCase().includes(searchValue) ||
        booking.roomName?.toLowerCase().includes(searchValue) ||
        String(booking.id).includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [myBookings, search, statusFilter]);

  const totalPages = Math.ceil(
    filteredBookings.length / ITEMS_PER_PAGE
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = async (bookingId, status) => {
    const action = status === "confirmed" ? "confirm" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this booking?`
    );

    if (!confirmed) {
      return;
    }

    setUpdatingId(bookingId);
    setActionError("");

    try {
      const result = await updateBookingStatus(
        bookingId,
        status,
        currentUser.id
      );

      if (result?.success === false) {
        setActionError(result.error || "Unable to update booking.");
      }
    } catch (error) {
      setActionError(error.message || "Unable to update booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">BOOKING MANAGEMENT</p>
          <h1>Booking Requests</h1>
          <p>Review reservations made for your properties.</p>
        </div>
      </div>

      {(error || actionError) && (
        <ErrorMessage message={actionError || error} />
      )}

      <div className="manager-booking-stats">
        <div>
          <span>Total Bookings</span>
          <strong>{myBookings.length}</strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>
            {myBookings.filter((b) => b.status === "pending").length}
          </strong>
        </div>

        <div>
          <span>Confirmed</span>
          <strong>
            {myBookings.filter((b) => b.status === "confirmed").length}
          </strong>
        </div>

        <div>
          <span>Rejected</span>
          <strong>
            {myBookings.filter((b) => b.status === "rejected").length}
          </strong>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-search"
          placeholder="Search customer, property or booking ID..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="admin-filter"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="manager-content-card">
        <div className="manager-section-heading">
          <h2>My Reservations</h2>
          <span>{filteredBookings.length} results</span>
        </div>

        {paginatedBookings.length === 0 ? (
          <p className="manager-muted">
            No bookings match your current search or filter.
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Property</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.customerName || "Customer"}</td>
                    <td>{booking.propertyName || "Property"}</td>
                    <td>{booking.roomName || "Room"}</td>
                    <td>{booking.checkIn}</td>
                    <td>{booking.checkOut}</td>
                    <td>
                      KES {Number(booking.total || 0).toLocaleString()}
                    </td>
                    <td>
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {booking.status === "pending" ? (
                        <div className="approval-actions">
                          <Button
                            size="small"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleStatusChange(booking.id, "confirmed")
                            }
                          >
                            Confirm
                          </Button>

                          <Button
                            variant="danger"
                            size="small"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleStatusChange(booking.id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="approval-completed">
                          No action required
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ManagerBookings;