
import React from "react";
import { Link } from "react-router-dom";
import PropertyStatus from "./PropertyStatus";

function PropertyList({ properties = [] }) {
  if (properties.length === 0) {
    return <p>You have not registered any properties yet.</p>;
  }

  return (
    <div className="property-grid">
      {properties.map((property) => (
        <article className="property-card" key={property.id}>
          <img
            src={property.image || "/images/default-property.jpg"}
            alt={property.name}
            onError={(event) => {
              event.currentTarget.src = "/images/default-property.jpg";
            }}
          />

          <div className="property-card-content">
            <h3>{property.name}</h3>
            <p>{property.location}</p>
            <p>{property.propertyType}</p>

            <PropertyStatus status={property.status} />

            <div className="property-actions">
              <Link to={`/manager/properties/${property.id}/edit`}>
                Edit Property
              </Link>

              <Link to={`/manager/properties/${property.id}/rooms`}>
                Manage Rooms
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default PropertyList;
