
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

import BookingFormComponent from "../../components/booking/BookingForm";
import { formatCurrency } from "../../utils/formatCurrency";

function BookingFormPage() {
  const { propertyId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const {
    properties,
    loading,
    error,
    setError,
    getRoomAvailability,
    createBooking
  } = useBookings();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");

  const property = useMemo(
    () =>
      properties.find(
        (item) =>
          String(item.id) === String(propertyId) &&
          item.status === "approved"
      ),
    [properties, propertyId]
  );

  // Select a room automatically when a roomId is provided in the URL.
  useEffect(() => {
    if (!property) return;

    const requestedRoomId = searchParams.get("roomId");

    if (!requestedRoomId) return;

    const room = property.rooms?.find(
      (item) =>
        String(item.id) === requestedRoomId &&
        item.available
    );

    setSelectedRoom(room || null);
  }, [property, searchParams]);

  async function handleBookingSubmit(formData) {
    setPageError("");
    setError?.("");

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!property || property.status !== "approved") {
      setPageError("This property is not available for booking.");
      return;
    }

    if (!selectedRoom || !selectedRoom.available) {
      setPageError("Please select an available room.");
      return;
    }

    setSubmitting(true);

    try {
      // Check room availability for the selected dates.
      const isAvailable = await getRoomAvailability(
        property.id,
        selectedRoom.id,
        formData.checkIn,
        formData.checkOut
      );

      if (!isAvailable) {
        setPageError(
          "This room is not available for the selected dates. Please choose different dates."
        );
        return;
      }

      const checkInDate = new Date(`${formData.checkIn}T00:00:00`);
      const checkOutDate = new Date(`${formData.checkOut}T00:00:00`);

      const nights = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );

      if (nights < 1) {
        setPageError("Please select valid check-in and check-out dates.");
        return;
      }

      const pricePerNight = Number(selectedRoom.pricePerNight);
      const total = pricePerNight * nights;

      const bookingData = {
        ...formData,
        customerId: currentUser.id,
        customerName: currentUser.name,
        propertyId: property.id,
        propertyName: property.name,
        managerId: property.managerId,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        nights,
        pricePerNight,
        total
      };

      const result = await createBooking(bookingData, currentUser);

      if (result?.success === false) {
        setPageError(result.error || "Unable to create your booking.");
        return;
      }

      navigate("/customer/bookings");
    } catch (err) {
      setPageError(
        err.message || "Something went wrong while creating your booking."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="loading-message">Loading property...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!property) {
    return (
      <main className="customer-page">
        <h2>Property unavailable</h2>
        <p>This property does not exist or has not been approved.</p>
        <button onClick={() => navigate("/properties")}>
          Browse properties
        </button>
      </main>
    );
  }

  const availableRooms = property.rooms?.filter(
    (room) => room.available
  ) || [];

  if (availableRooms.length === 0) {
    return (
      <main className="customer-page">
        <h2>No rooms available</h2>
        <p>This property currently has no available rooms.</p>
        <button onClick={() => navigate(`/properties/${property.id}`)}>
          Back to property
        </button>
      </main>
    );
  }

  return (
    <main className="customer-page booking-page">
      <div className="customer-page-header">
        <button
          type="button"
          onClick={() => navigate(`/properties/${property.id}`)}
          className="btn btn-secondary"
        >
          Back to property
        </button>

        <h1>Book your stay</h1>
        <p>{property.name}</p>
        <p>{property.location}</p>
      </div>

      {pageError && (
        <div className="error-message">
          {pageError}
        </div>
      )}

      <div className="booking-page-content">
        <section className="booking-form-section">
          <BookingFormComponent
            property={property}
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
            onSubmit={handleBookingSubmit}
            loading={submitting}
          />
        </section>

        <aside className="booking-property-summary">
          <h3>Property information</h3>

          <img
            src={property.image || "/images/default-property.jpg"}
            alt={property.name}
            className="booking-property-image"
          />

          <h3>{property.name}</h3>
          <p>{property.location}</p>

          {selectedRoom && (
            <div className="selected-room-summary">
              <p>Selected room: {selectedRoom.name}</p>
              <p>
                Price per night:{" "}
                {formatCurrency(selectedRoom.pricePerNight)}
              </p>
              <p>Maximum guests: {selectedRoom.capacity}</p>
            </div>
          )}

          <p className="booking-form-note">
            Your booking request will be sent to the property manager.
            No payment is collected in this demonstration.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default BookingFormPage;
