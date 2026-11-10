import { useMemo, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import ManagerTable from "../../components/admin/ManagerTable";
import AdminPagination from "../../components/admin/AdminPagination";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const ITEMS_PER_PAGE = 8;

const Managers = () => {
  const {
    users,
    updateUserStatus,
    loading,
    error: authError,
  } = useAuth();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const managers = users.filter((user) => user.role === "manager");

  const filteredManagers = useMemo(() => {
    return managers.filter((manager) => {
      const matchesSearch =
        manager.name?.toLowerCase().includes(search.toLowerCase()) ||
        manager.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || manager.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [managers, search, statusFilter]);

  const totalPages = Math.ceil(filteredManagers.length / ITEMS_PER_PAGE);

  const paginatedManagers = filteredManagers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = async (managerId, status) => {
    setUpdatingId(managerId);
    setActionError("");

    try {
      const result = await updateUserStatus(managerId, status);

      if (!result?.success) {
        setActionError(result?.error || "Unable to update manager status.");
      }
    } catch (error) {
      setActionError(error.message || "Something went wrong.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-eyebrow">ADMINISTRATION</p>
          <h1>Manager Approvals</h1>
          <p>Review and manage property manager accounts.</p>
        </div>
      </div>

      {(authError || actionError) && (
        <ErrorMessage message={actionError || authError} />
      )}

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-search"
          placeholder="Search by name or email..."
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
          <option value="all">All managers</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="admin-content-card">
        <div className="admin-section-heading">
          <h2>Managers</h2>
          <span>{filteredManagers.length} results</span>
        </div>

        <ManagerTable
          managers={paginatedManagers}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Managers;