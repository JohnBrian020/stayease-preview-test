
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

function EditProperty() {
  const { propertyId } = useParams();
  const { currentUser } = useAuth();
  const { properties, updateProperty } = useBookings();
  const navigate = useNavigate();

  const property = properties.find(
    (item) => String(item.id) === String(propertyId)
  );

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    propertyType: "hotel",
    image: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || "",
        location: property.location || "",
        description: property.description || "",
        propertyType: property.propertyType || "hotel",
        image: property.image || ""
      });
    }
  }, [property]);

  if (!property) {
    return (
      <div className="dashboard-page">
        <h1>Property not found</h1>
        <Link to="/manager/properties">Back to Properties</Link>
      </div>
    );
  }

  if (String(property.managerId) !== String(currentUser?.id)) {
    return (
      <div className="dashboard-page">
        <h1>Access denied</h1>
        <p>You cannot edit another manager's property.</p>
      </div>
    );
  }

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

    if (!formData.name.trim() || !formData.location.trim() || !formData.description.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      updateProperty(property.id, formData, currentUser.id);
      navigate("/manager/properties");
    } catch (err) {
      setError(err.message || "Unable to update property.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Edit Property</h1>
          <p>Update your property information.</p>
        </div>

        <Link to="/manager/properties" className="btn btn-secondary">
          Back
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
          required
        />

        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
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
          required
        />

        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProperty;
