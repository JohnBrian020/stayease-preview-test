
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

function AddProperty() {
  const { currentUser } = useAuth();
  const { addProperty } = useBookings();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    propertyType: "hotel",
    image: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!currentUser) {
      setError("You must be logged in to register a property.");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      addProperty(formData, currentUser.id);
      navigate("/manager/properties");
    } catch (err) {
      setError(err.message || "Unable to register property.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Register Property</h1>
          <p>Add a property to StayEase.</p>
        </div>

        <Link to="/manager/properties" className="btn btn-secondary">
          Back to Properties
        </Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <label htmlFor="name">Property Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Sunrise Apartments"
          required
        />

        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Nairobi, Kenya"
          required
        />

        <label htmlFor="propertyType">Property Type</label>
        <select
          id="propertyType"
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
        >
          <option value="hotel">Hotel</option>
          <option value="apartment">Apartment</option>
          <option value="guesthouse">Guesthouse</option>
          <option value="hostel">Hostel</option>
          <option value="villa">Villa</option>
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          placeholder="Describe your property..."
          required
        />

        <label htmlFor="image">Image URL (optional)</label>
        <input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/property.jpg"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Property"}
        </button>
      </form>
    </div>
  );
}

export default AddProperty;
