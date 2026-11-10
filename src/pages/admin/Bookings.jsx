import { useMemo, useState } from "react";

import { useBookings } from "../../context/BookingContext";

import BookingTable from "../../components/admin/BookingTable";
import AdminPagination from "../../components/admin/AdminPagination";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const ITEMS_PER_PAGE = 10;

const Bookings = () => {
  const {
    bookings,
    loading,
    error,
  } = useBookings();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
          booking.customerName?.toLowerCase().includes(searchValue) ||
          booking.propertyName?.toLowerCase().includes(searchValue) ||
          booking.roomName?.toLowerCase().includes(searchValue) ||
          String(booking.id).includes(searchValue);

        const matchesStatus =
          statusFilter === "all" || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
  }, [bookings, search, statusFilter]);

  const totalPages = Math.ceil(
    filteredBookings.length / ITEMS_PER_PAGE
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-eyebrow">ADMINISTRATION</p>
          <h1>Booking Management</h1>
          <p>Monitor reservations made by StayEase customers.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-search"
          placeholder="Search customer, property, room or booking ID..."
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

      <div className="admin-content-card">
        <div className="admin-section-heading">
          <h2>All Bookings</h2>
          <span>{filteredBookings.length} results</span>
        </div>

        <BookingTable bookings={paginatedBookings} />

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Bookings;