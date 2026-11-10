
import React, { useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";

function RoomForm({
  initialData = {},
  onSubmit,
  submitLabel = "Add Room",
  loading = false
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    capacity: "2",
    totalRooms: "1",
    ...initialData
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function validate() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required.";
    }

    if (
      !Number.isFinite(Number(formData.pricePerNight)) ||
      Number(formData.pricePerNight) <= 0
    ) {
      newErrors.pricePerNight = "Enter a valid nightly price.";
    }

    if (
      !Number.isInteger(Number(formData.capacity)) ||
      Number(formData.capacity) < 1
    ) {
      newErrors.capacity = "Capacity must be at least 1.";
    }

    if (
      !Number.isInteger(Number(formData.totalRooms)) ||
      Number(formData.totalRooms) < 1
    ) {
      newErrors.totalRooms = "Enter at least 1 room.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      pricePerNight: Number(formData.pricePerNight),
      capacity: Number(formData.capacity),
      totalRooms: Number(formData.totalRooms),
      available: true
    });
  }

  return (
    <form className="manager-form" onSubmit={handleSubmit}>
      <Input
        label="Room Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g. Deluxe Double Room"
        required
        error={errors.name}
      />

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe the room"
      />

      <Input
        label="Price Per Night (KES)"
        name="pricePerNight"
        type="number"
        min="1"
        value={formData.pricePerNight}
        onChange={handleChange}
        required
        error={errors.pricePerNight}
      />

      <Input
        label="Guest Capacity"
        name="capacity"
        type="number"
        min="1"
        value={formData.capacity}
        onChange={handleChange}
        required
        error={errors.capacity}
      />

      <Input
        label="Number of Rooms"
        name="totalRooms"
        type="number"
        min="1"
        value={formData.totalRooms}
        onChange={handleChange}
        required
        error={errors.totalRooms}
      />

      <Button type="submit" loading={loading} fullWidth>
        {submitLabel}
      </Button>
    </form>
  );
}

export default RoomForm;
