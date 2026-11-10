import StatusBadge from "../common/StatusBadge";
import ApprovalActions from "./ApprovalActions";
import EmptyState from "../common/EmptyState";

const ManagerTable = ({
  managers,
  onStatusChange,
  updatingId,
}) => {
  if (managers.length === 0) {
    return (
      <EmptyState
        title="No managers found"
        message="There are no managers matching your search."
      />
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Manager</th>
            <th>Email</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {managers.map((manager) => (
            <tr key={manager.id}>
              <td>
                <div className="table-user">
                  <div className="user-avatar">
                    {manager.name?.charAt(0).toUpperCase() || "M"}
                  </div>

                  <span>{manager.name}</span>
                </div>
              </td>

              <td>{manager.email}</td>

              <td>
                <StatusBadge status={manager.status} />
              </td>

              <td>
                {manager.createdAt
                  ? new Date(manager.createdAt).toLocaleDateString()
                  : "—"}
              </td>

              <td>
                <ApprovalActions
                  status={manager.status}
                  disabled={updatingId === manager.id}
                  onApprove={() =>
                    onStatusChange(manager.id, "approved")
                  }
                  onReject={() =>
                    onStatusChange(manager.id, "rejected")
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerTable;