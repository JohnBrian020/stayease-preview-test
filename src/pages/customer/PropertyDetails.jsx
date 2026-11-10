import { Link, useParams } from "react-router-dom";
import { useBookings } from "../../context/BookingContext";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import PropertyGallery from "../../components/customer/PropertyGallery";
import RoomCard from "../../components/customer/RoomCard";

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const { properties = [], loading, error } = useBookings();

  if (loading) {
    return <Loading message="Loading property details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const property = properties.find(
    (item) =>
      String(item.id) === String(propertyId) &&
      item.status === "approved"
  );

  if (!property) {
    return (
      <main className="customer-page">
        <EmptyState
          title="Property not found"
          message="This property does not exist or is not approved."
        />

        <Link to="/properties" className="btn btn-primary">
          Browse properties
        </Link>
      </main>
    );
  }

  const rooms = property.rooms || [];

  return (
    <main className="customer-page">
      <Link to="/properties" className="back-link">
        ← Back to properties
      </Link>

      <section className="property-details">
        <PropertyGallery
          images={[property.image]}
          propertyName={property.name}
        />

        <div className="property-details-content">
          <span className="property-type">
            {property.propertyType}
          </span>

          <h1>{property.name}</h1>

          <p className="property-location">
            {property.location}
          </p>

          <p>{property.description}</p>
        </div>
      </section>

      <section className="customer-room-section">
        <div className="section-heading">
          <h2>Available room types</h2>
          <span>{rooms.length} room types</span>
        </div>

        {rooms.length === 0 ? (
          <EmptyState
            title="No rooms listed"
            message="The property manager has not added any rooms yet."
          />
        ) : (
          <div className="customer-room-grid">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                propertyId={property.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default PropertyDetails;