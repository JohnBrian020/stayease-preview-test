import React, { useState } from "react";

import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

import DateSelector from "./DateSelector";
import PriceCalculator from "./PriceCalculator";

import { validateStay } from "../../utils/validation";

function BookingForm({
  property,
  selectedRoom,
  onRoomChange,
  onSubmit,
  loading = false
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [error, setError] = useState("");

  const availableRooms = property.rooms.filter(
    (room) => room.available
  );

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!selectedRoom) {
      setError("Please select a room.");
      return;
    }

    const dateError = validateStay(checkIn, checkOut);

    if (dateError) {
      setError(dateError);
      return;
    }

    const guestCount = Number(guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > selectedRoom.capacity
    ) {
      setError(
        `This room accommodates 1 to ${selectedRoom.capacity} guests.`
      );
      return;
    }

    onSubmit({
      propertyId: property.id,
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      guests: guestCount
    });
  }

  const roomOptions = availableRooms.map((room) => ({
    value: String(room.id),
    label: `${room.name} — KES ${room.pricePerNight.toLocaleString()} per night`
  }));

  function handleRoomChange(event) {
    const roomId = Number(event.target.value);

    const room = availableRooms.find(
      (item) => item.id === roomId
    );

    onRoomChange(room || null);
    setGuests("1");
    setError("");
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Make a booking request</h2>

      <ErrorMessage message={error} />

      <Select
        label="Choose a room"
        name="roomId"
        value={selectedRoom ? String(selectedRoom.id) : ""}
        onChange={handleRoomChange}
        options={roomOptions}
        placeholder="Select a room"
        required
      />

      {selectedRoom && (
        <>
          <DateSelector
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
          />

          <Input
            label={`Number of guests (maximum ${selectedRoom.capacity})`}
            name="guests"
            type="number"
            min="1"
            max={selectedRoom.capacity}
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            required
          />

          <PriceCalculator
            room={selectedRoom}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        </>
      )}

      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={!selectedRoom}
      >
        Submit booking request
      </Button>

      <p className="booking-form-note">
        Your request will be sent to the property manager.
        Payment is not collected in this demonstration.
      </p>
    </form>
  );
}

export default BookingForm;