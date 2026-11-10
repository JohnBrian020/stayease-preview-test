import { useMemo, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

import PropertyApprovalCard from "../../components/admin/PropertyApprovalCard";
import AdminPagination from "../../components/admin/AdminPagination";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

const ITEMS_PER_PAGE = 6;

const Properties = () => {
  const { users, loading: authLoading } = useAuth();

  const {
    properties,
    updatePropertyStatus,
    loading: bookingLoading,
    error: bookingError,
  } = useBookings();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.name?.toLowerCase().includes(search.toLowerCase()) ||
        property.location?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || property.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [properties, search, statusFilter]);

  const totalPages = Math.ceil(
    filteredProperties.length / ITEMS_PER_PAGE
  );

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getManagerName = (managerId) => {
    const manager = users.find(
      (user) => user.id === managerId
    );

    return manager?.name || "Unknown manager";
  };

  const handleStatusChange = async (propertyId, status) => {
    setUpdatingId(propertyId);
    setActionError("");

    try {
      const result = await updatePropertyStatus(propertyId, status);

      if (!result?.success) {
        setActionError(result?.error || "Unable to update property status.");
      }
    } catch (error) {
      setActionError(error.message || "Something went wrong.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || bookingLoading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-eyebrow">ADMINISTRATION</p>
          <h1>Property Approvals</h1>
          <p>Review properties submitted by registered managers.</p>
        </div>
      </div>

      {(bookingError || actionError) && (
        <ErrorMessage message={actionError || bookingError} />
      )}

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-search"
          placeholder="Search properties or locations..."
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
          <option value="all">All properties</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="admin-section-heading">
        <h2>Submitted Properties</h2>
        <span>{filteredProperties.length} results</span>
      </div>

      {paginatedProperties.length === 0 ? (
        <EmptyState
          title="No properties found"
          message="There are no properties matching your search or filter."
        />
      ) : (
        <div className="property-approval-grid">
          {paginatedProperties.map((property) => (
            <PropertyApprovalCard
              key={property.id}
              property={property}
              managerName={getManagerName(property.managerId)}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Properties;