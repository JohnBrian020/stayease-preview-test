import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

import RoomForm from "../../components/manager/RoomForm";
import RoomList from "../../components/manager/RoomList";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const ManageRooms = () => {
  const { propertyId } = useParams();

  const { currentUser } = useAuth();

  const {
    properties,
    addRoom,
    loading,
  } = useBookings();

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return <Loading />;
  }

  const property = properties.find(
    (item) =>
      String(item.id) === String(propertyId) &&
      item.managerId === currentUser.id
  );

  if (!property) {
    return (
      <div className="manager-page">
        <ErrorMessage message="Property not found or you do not have permission to manage it." />
      </div>
    );
  }

  const handleAddRoom = async (formData) => {
    setSaving(true);
    setError("");

    try {
      const result = await addRoom(
        property.id,
        formData,
        currentUser.id
      );

      if (result?.success === false) {
        setError(result.error || "Unable to add room.");
        return;
      }

      setShowForm(false);
    } catch (error) {
      setError(error.message || "Unable to add room.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">ROOM MANAGEMENT</p>
          <h1>{property.name}</h1>
          <p>Manage the rooms available at this property.</p>
        </div>

        <Link
          to={`/manager/properties/${property.id}/edit`}
          className="secondary-link"
        >
          Edit Property
        </Link>
      </div>

      <div className="manager-property-summary">
        <p>
          <strong>Location:</strong> {property.location}
        </p>

        <p>
          <strong>Approval status:</strong> {property.status}
        </p>

        <p>
          <strong>Room types:</strong> {property.rooms?.length || 0}
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="manager-section-heading">
        <h2>Rooms</h2>

        <button
          type="button"
          className="primary-link"
          onClick={() => setShowForm((previous) => !previous)}
        >
          {showForm ? "Close Form" : "+ Add Room"}
        </button>
      </div>

      {showForm && (
        <div className="manager-content-card">
          <h2>Add a Room</h2>

          <RoomForm
            onSubmit={handleAddRoom}
            submitLabel="Save Room"
            loading={saving}
          />
        </div>
      )}

      <RoomList
        rooms={property.rooms || []}
        propertyId={property.id}
      />
    </div>
  );
};

export default ManageRooms;