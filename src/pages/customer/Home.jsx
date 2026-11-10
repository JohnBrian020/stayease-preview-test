import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBookings } from "../../context/BookingContext";
import LocationSearch from "../../components/customer/LocationSearch";
import PropertyGrid from "../../components/customer/PropertyGrid";

const Home = () => {
  const navigate = useNavigate();
  const { properties = [], loading, error } = useBookings();
  const [location, setLocation] = useState("");

  const approvedProperties = properties.filter(
    (property) => property.status === "approved"
  );

  const handleSearch = () => {
    navigate(`/properties?location=${encodeURIComponent(location.trim())}`);
  };

  return (
    <main className="customer-home">
      <section className="customer-hero">
        <div className="customer-hero-content">
          <span className="hero-eyebrow">WELCOME TO STAYEASE</span>

          <h1>Find your perfect place to stay.</h1>

          <p>
            Discover accommodation, compare rooms and make your
            reservation easily with StayEase.
          </p>

          <LocationSearch
            value={location}
            onChange={setLocation}
            onSubmit={handleSearch}
          />

          <Link to="/properties" className="btn btn-primary">
            Explore properties
          </Link>
        </div>
      </section>

      <section className="customer-home-section">
        <div className="section-heading">
          <div>
            <h2>Featured properties</h2>
            <p>Explore accommodation approved by StayEase.</p>
          </div>

          <Link to="/properties">View all properties</Link>
        </div>

        {loading && <p>Loading properties...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && approvedProperties.length === 0 && (
          <div className="empty-state">
            <h3>No properties available yet</h3>
            <p>Please check again later.</p>
          </div>
        )}

        {!loading && !error && approvedProperties.length > 0 && (
          <PropertyGrid properties={approvedProperties.slice(0, 3)} />
        )}
      </section>

      <section className="customer-how-it-works">
        <h2>How StayEase works</h2>

        <div className="customer-steps-grid">
          <article>
            <span>01</span>
            <h3>Find accommodation</h3>
            <p>Browse approved properties and compare available rooms.</p>
          </article>

          <article>
            <span>02</span>
            <h3>Make a reservation</h3>
            <p>Select your room, dates and number of guests.</p>
          </article>

          <article>
            <span>03</span>
            <h3>Get confirmation</h3>
            <p>Track your booking while the property manager responds.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Home;