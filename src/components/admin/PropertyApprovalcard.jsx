import StatusBadge from "../common/StatusBadge";
import ApprovalActions from "./ApprovalActions";

const PropertyApprovalCard = ({
  property,
  managerName,
  onStatusChange,
  updatingId,
}) => {
  return (
    <div className="property-approval-card">
      <div className="property-approval-image">
        <img
          src={property.image || "/images/default-property.jpg"}
          alt={property.name}
          onError={(event) => {
            event.currentTarget.src = "/images/default-property.jpg";
          }}
        />
      </div>

      <div className="property-approval-content">
        <div className="property-approval-heading">
          <div>
            <h3>{property.name}</h3>
            <p>{property.location}</p>
          </div>

          <StatusBadge status={property.status} />
        </div>

        <div className="property-approval-details">
          <p>
            <strong>Manager:</strong> {managerName || "Unknown"}
          </p>

          <p>
            <strong>Property type:</strong>{" "}
            {property.propertyType || "Not specified"}
          </p>

          <p>
            <strong>Rooms:</strong> {property.rooms?.length || 0}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {property.description || "No description provided"}
          </p>
        </div>

        <ApprovalActions
          status={property.status}
          disabled={updatingId === property.id}
          onApprove={() => onStatusChange(property.id, "approved")}
          onReject={() => onStatusChange(property.id, "rejected")}
        />
      </div>
    </div>
  );
};

export default PropertyApprovalCard;