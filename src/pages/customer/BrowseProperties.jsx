import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBookings } from "../../context/BookingContext";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import PropertySearch from "../../components/customer/PropertySearch";
import PropertyFilters from "../../components/customer/PropertyFilters";
import PropertyGrid from "../../components/customer/PropertyGrid";

const BrowseProperties = () => {
  const { properties = [], loading, error } = useBookings();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("location") || ""
  );

  const [propertyType, setPropertyType] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const approvedProperties = useMemo(
    () => properties.filter(
      (property) => property.status === "approved"
    ),
    [properties]
  );

  const propertyTypes = useMemo(
    () => [
      ...new Set(
        approvedProperties
          .map((property) => property.propertyType)
          .filter(Boolean)
      ),
    ],
    [approvedProperties]
  );

  const filteredProperties = useMemo(() => {
    return approvedProperties.filter((property) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        !searchTerm ||
        property.name?.toLowerCase().includes(searchTerm) ||
        property.location?.toLowerCase().includes(searchTerm);

      const matchesType =
        propertyType === "all" ||
        property.propertyType === propertyType;

      const prices = (property.rooms || [])
        .map((room) => Number(room.pricePerNight))
        .filter((price) => Number.isFinite(price));

      const lowestPrice = prices.length
        ? Math.min(...prices)
        : null;

      const matchesPrice =
        maxPrice === "" ||
        (lowestPrice !== null && lowestPrice <= Number(maxPrice));

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [approvedProperties, search, propertyType, maxPrice]);

  const clearFilters = () => {
    setSearch("");
    setPropertyType("all");
    setMaxPrice("");
  };

  if (loading) {
    return <Loading message="Loading properties..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main className="customer-page">
      <header className="customer-page-header">
        <div>
          <h1>Browse properties</h1>
          <p>Find accommodation that matches your needs.</p>
        </div>
      </header>

      <section className="customer-search-panel">
        <PropertySearch
          value={search}
          onChange={setSearch}
        />

        <PropertyFilters
          propertyTypes={propertyTypes}
          propertyType={propertyType}
          onPropertyTypeChange={setPropertyType}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          onClear={clearFilters}
        />
      </section>

      <section className="customer-property-section">
        <div className="section-heading">
          <h2>Available properties</h2>
          <span>{filteredProperties.length} properties found</span>
        </div>

        {filteredProperties.length === 0 ? (
          <EmptyState
            title="No properties found"
            message="Try changing your search or filters."
          />
        ) : (
          <PropertyGrid properties={filteredProperties} />
        )}
      </section>
    </main>
  );
};

export default BrowseProperties;