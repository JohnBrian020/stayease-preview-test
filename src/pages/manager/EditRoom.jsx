
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

function EditRoom() {
  const { propertyId, roomId } = useParams();
  const { currentUser } = useAuth();
  const { properties, updateRoom } = useBookings();
  const navigate = useNavigate();

  const property = properties.find(
    (item) => String(item.id) === String(propertyId)
  );

  const room = property?.rooms?.find(
    (item) => String(item.id) === String(roomId)
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    capacity: "",
    totalRooms: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        description: room.description || "",
        pricePerNight: room.pricePerNight ?? "",
        capacity: room.capacity ?? "",
        totalRooms: room.totalRooms ?? ""
      });
    }
  }, [room]);

  if (!property || !room) {
    return (
      <div className="dashboard-page">
        <h1>Room not found</h1>
        <Link to="/manager/properties">Back to Properties</Link>
      </div>
    );
  }

  if (String(property.managerId) !== String(currentUser?.id)) {
    return (
      <div className="dashboard-page">
        <h1>Access denied</h1>
        <p>You cannot edit rooms belonging to another manager.</p>
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

    if (
      !formData.name.trim() ||
      Number(formData.pricePerNight) <= 0 ||
      Number(formData.capacity) < 1 ||
      Number(formData.totalRooms) < 1
    ) {
      setError("Enter a room name and valid price, capacity and room quantity.");
      return;
    }

    setLoading(true);

    try {
      updateRoom(property.id, room.id, {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        totalRooms: Number(formData.totalRooms)
      }, currentUser.id);

      navigate(`/manager/properties/${property.id}/rooms`);
    } catch (err) {
      setError(err.message || "Unable to update room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Edit Room</h1>
          <p>Update room information for {property.name}.</p>
        </div>

        <Link
          to={`/manager/properties/${property.id}/rooms`}
          className="btn btn-secondary"
        >
          Back to Rooms
        </Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <label htmlFor="name">Room Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />

        <label htmlFor="pricePerNight">Price per Night (KES)</label>
        <input
          id="pricePerNight"
          name="pricePerNight"
          type="number"
          min="1"
          value={formData.pricePerNight}
          onChange={handleChange}
          required
        />

        <label htmlFor="capacity">Guest Capacity</label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          min="1"
          value={formData.capacity}
          onChange={handleChange}
          required
        />

        <label htmlFor="totalRooms">Total Rooms</label>
        <input
          id="totalRooms"
          name="totalRooms"
          type="number"
          min="1"
          value={formData.totalRooms}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Room Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditRoom;
