import Button from "../common/Button";

const ApprovalActions = ({
  status,
  onApprove,
  onReject,
  disabled = false,
}) => {
  if (status !== "pending") {
    return (
      <span className="approval-completed">
        No action required
      </span>
    );
  }

  const handleReject = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this request?"
    );

    if (confirmed) {
      onReject();
    }
  };

  return (
    <div className="approval-actions">
      <Button
        variant="primary"
        size="small"
        disabled={disabled}
        onClick={onApprove}
      >
        Approve
      </Button>

      <Button
        variant="danger"
        size="small"
        disabled={disabled}
        onClick={handleReject}
      >
        Reject
      </Button>
    </div>
  );
};

export default ApprovalActions;