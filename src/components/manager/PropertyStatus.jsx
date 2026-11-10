
import React from "react";
import StatusBadge from "../common/StatusBadge";

function PropertyStatus({ status = "pending" }) {
  return (
    <div className="property-status">
      <span>Approval status: </span>
      <StatusBadge status={status} />
    </div>
  );
}

export default PropertyStatus;
