import React from "react";

const propertyTypes = [
  "All",
  "Apartment",
  "Guest House",
  "Hotel",
  "Lodge"
];

function PropertyFilters({
  selectedType,
  onTypeChange,
  sortOrder,
  onSortChange
}) {
  return (
    <div className="property-filters">
      <div className="filter-group">
        <label htmlFor="property-type-filter">
          Property type
        </label>

        <select
          id="property-type-filter"
          value={selectedType}
          onChange={(event) => onTypeChange(event.target.value)}
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type === "All" ? "All property types" : type}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="property-sort">
          Sort by price
        </label>

        <select
          id="property-sort"
          value={sortOrder}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="default">Recommended</option>
          <option value="low-high">Price: Low to high</option>
          <option value="high-low">Price: High to low</option>
        </select>
      </div>
    </div>
  );
}

export default PropertyFilters;