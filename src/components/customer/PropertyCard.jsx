import React from "react";
import { Link } from "react-router-dom";

import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";

function PropertyCard({ property }) {
  const rooms = property.rooms || [];

  const availableRooms = rooms.filter(
    (room) => room.available
  );

  const lowestPrice = availableRooms.length
    ? Math.min(...availableRooms.map((room) => room.pricePerNight))
    : null;

  return (
    <article className="property-card">
      <Link
        to={`/properties/${property.id}`}
        className="property-card-image-link"
      >
        <img
          src={property.image || "/images/default-property.jpg"}
          alt={property.name}
          className="property-card-image"
          onError={(event) => {
            event.currentTarget.src = "/images/default-property.jpg";
          }}
        />
      </Link>

      <div className="property-card-body">
        <div className="property-card-topline">
          <span className="property-type">
            {property.propertyType}
          </span>

          {property.status !== "approved" && (
            <StatusBadge status={property.status} />
          )}
        </div>

        <h3>
          <Link to={`/properties/${property.id}`}>
            {property.name}
          </Link>
        </h3>

        <p className="property-location">
          <span aria-hidden="true">⌖</span>
          {property.location}
        </p>

        <p className="property-description">
          {property.description}
        </p>

        <div className="property-card-footer">
          <div>
            {lowestPrice !== null ? (
              <>
                <span className="price-label">From</span>
                <strong>{formatCurrency(lowestPrice)}</strong>
                <span className="price-period">/ night</span>
              </>
            ) : (
              <span className="muted-text">No rooms available</span>
            )}
          </div>

          <Button
            variant="primary"
            size="small"
            onClick={() => {
              window.location.href = `/properties/${property.id}`;
            }}
          >
            View stay
          </Button>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;