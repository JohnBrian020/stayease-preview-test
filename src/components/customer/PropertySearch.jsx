import React, { useState } from "react";
import Button from "../common/Button";

function PropertySearch({
  onSearch,
  initialValue = ""
}) {
  const [location, setLocation] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(location.trim());
  }

  return (
    <form className="property-search" onSubmit={handleSubmit}>
      <div className="property-search-input">
        <label htmlFor="property-location-search">
          Where would you like to stay?
        </label>

        <input
          id="property-location-search"
          type="search"
          placeholder="Search by town or location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </div>

      <Button type="submit">
        Search stays
      </Button>
    </form>
  );
}

export default PropertySearch;