import React from "react";

import PropertyCard from "./PropertyCard";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";
import EmptyState from "../common/EmptyState";

function PropertyGrid({
  properties = [],
  loading = false,
  error = "",
  onRetry
}) {
  if (loading) {
    return <Loading message="Loading properties..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        icon="⌂"
        title="No properties found"
        message="Try changing your search or filters."
      />
    );
  }

  return (
    <div className="property-grid">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
        />
      ))}
    </div>
  );
}

export default PropertyGrid;