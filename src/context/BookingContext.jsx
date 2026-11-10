import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { initialMockData } from "../data/mockData";

import {
  calculateNights
} from "../utils/formatDate";

import {
  validateStay
} from "../utils/validation";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem("stayease_properties");

    return saved
      ? JSON.parse(saved)
      : initialMockData.properties;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("stayease_bookings");

    return saved
      ? JSON.parse(saved)
      : initialMockData.bookings;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "stayease_properties",
      JSON.stringify(properties)
    );
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(
      "stayease_bookings",
      JSON.stringify(bookings)
    );
  }, [bookings]);

  // -------------------------------
  // PROPERTY OPERATIONS
  // -------------------------------

  function addProperty(formData, managerId) {
    if (!managerId) {
      return {
        success: false,
        error: "Manager account is required."
      };
    }

    const requiredFields = [
      "name",
      "location",
      "description",
      "propertyType"
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        return {
          success: false,
          error: `${field} is required.`
        };
      }
    }

    const newProperty = {
      id: Date.now(),
      managerId,
      name: formData.name.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      propertyType: formData.propertyType,
      image: formData.image || "/images/default-property.jpg",
      status: "pending",
      createdAt: new Date().toISOString(),
      rooms: []
    };

    setProperties((previous) => [
      ...previous,
      newProperty
    ]);

    return {
      success: true,
      property: newProperty
    };
  }

  function updateProperty(propertyId, formData, managerId) {
    const property = properties.find(
      (item) => item.id === Number(propertyId)
    );

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    if (property.managerId !== managerId) {
      return {
        success: false,
        error: "You cannot edit this property."
      };
    }

    if (
      !formData.name?.trim() ||
      !formData.location?.trim() ||
      !formData.description?.trim()
    ) {
      return {
        success: false,
        error: "Complete all required property fields."
      };
    }

    setProperties((previous) =>
      previous.map((item) =>
        item.id === Number(propertyId)
          ? {
              ...item,
              ...formData,
              name: formData.name.trim(),
              location: formData.location.trim(),
              description: formData.description.trim()
            }
          : item
      )
    );

    return { success: true };
  }

  function updatePropertyStatus(propertyId, status) {
    const allowed = ["pending", "approved", "rejected"];

    if (!allowed.includes(status)) {
      return {
        success: false,
        error: "Invalid property status."
      };
    }

    const exists = properties.some(
      (item) => item.id === Number(propertyId)
    );

    if (!exists) {
      return { success: false, error: "Property not found." };
    }

    setProperties((previous) =>
      previous.map((item) =>
        item.id === Number(propertyId)
          ? { ...item, status }
          : item
      )
    );

    return { success: true };
  }

  // -------------------------------
  // ROOM OPERATIONS
  // -------------------------------

  function addRoom(propertyId, formData, managerId) {
    const property = properties.find(
      (item) => item.id === Number(propertyId)
    );

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    if (property.managerId !== managerId) {
      return {
        success: false,
        error: "You cannot add rooms to this property."
      };
    }

    const price = Number(formData.pricePerNight);
    const capacity = Number(formData.capacity);
    const totalRooms = Number(formData.totalRooms);

    if (!formData.name?.trim()) {
      return { success: false, error: "Room name is required." };
    }

    if (!Number.isFinite(price) || price <= 0) {
      return {
        success: false,
        error: "Enter a valid room price."
      };
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
      return {
        success: false,
        error: "Room capacity must be at least one."
      };
    }

    if (!Number.isInteger(totalRooms) || totalRooms < 1) {
      return {
        success: false,
        error: "Number of rooms must be at least one."
      };
    }

    const newRoom = {
      id: Date.now(),
      propertyId: property.id,
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      pricePerNight: price,
      capacity,
      totalRooms,
      available: true
    };

    setProperties((previous) =>
      previous.map((item) =>
        item.id === property.id
          ? {
              ...item,
              rooms: [...item.rooms, newRoom]
            }
          : item
      )
    );

    return {
      success: true,
      room: newRoom
    };
  }

  function updateRoom(propertyId, roomId, formData, managerId) {
    const property = properties.find(
      (item) => item.id === Number(propertyId)
    );

    if (!property || property.managerId !== managerId) {
      return {
        success: false,
        error: "Property not found or access denied."
      };
    }

    const room = property.rooms.find(
      (item) => item.id === Number(roomId)
    );

    if (!room) {
      return { success: false, error: "Room not found." };
    }

    const price = Number(formData.pricePerNight);
    const capacity = Number(formData.capacity);
    const totalRooms = Number(formData.totalRooms);

    if (!formData.name?.trim() || price <= 0 ||
        capacity < 1 || totalRooms < 1) {
      return {
        success: false,
        error: "Enter valid room details."
      };
    }

    setProperties((previous) =>
      previous.map((item) => {
        if (item.id !== property.id) {
          return item;
        }

        return {
          ...item,
          rooms: item.rooms.map((existingRoom) =>
            existingRoom.id === Number(roomId)
              ? {
                  ...existingRoom,
                  ...formData,
                  name: formData.name.trim(),
                  pricePerNight: price,
                  capacity,
                  totalRooms
                }
              : existingRoom
          )
        };
      })
    );

    return { success: true };
  }

  // -------------------------------
  // ROOM AVAILABILITY
  // -------------------------------

  function getRoomAvailability(propertyId, roomId, checkIn, checkOut) {
    const property = properties.find(
      (item) => item.id === Number(propertyId)
    );

    if (!property || property.status !== "approved") {
      return {
        available: false,
        error: "This property is not approved for booking."
      };
    }

    const room = property.rooms.find(
      (item) => item.id === Number(roomId)
    );

    if (!room || !room.available) {
      return {
        available: false,
        error: "This room is not available."
      };
    }

    const dateError = validateStay(checkIn, checkOut);

    if (dateError) {
      return { available: false, error: dateError };
    }

    const overlapping = bookings.filter((booking) => {
      const sameRoom =
        booking.propertyId === Number(propertyId) &&
        booking.roomId === Number(roomId);

      const activeStatus = [
        "pending",
        "confirmed"
      ].includes(booking.status);

      const datesOverlap =
        checkIn < booking.checkOut &&
        checkOut > booking.checkIn;

      return sameRoom && activeStatus && datesOverlap;
    });

    if (overlapping.length >= room.totalRooms) {
      return {
        available: false,
        error: "No rooms are available for these dates."
      };
    }

    return {
      available: true,
      room,
      remainingRooms: room.totalRooms - overlapping.length
    };
  }

  // -------------------------------
  // BOOKING OPERATIONS
  // -------------------------------

  function createBooking(formData, customer) {
    setLoading(true);
    setError("");

    try {
      if (!customer || customer.role !== "customer") {
        return {
          success: false,
          error: "You must be logged in as a customer."
        };
      }

      const property = properties.find(
        (item) => item.id === Number(formData.propertyId)
      );

      if (!property) {
        return { success: false, error: "Property not found." };
      }

      const room = property.rooms.find(
        (item) => item.id === Number(formData.roomId)
      );

      if (!room) {
        return { success: false, error: "Room not found." };
      }

      const guests = Number(formData.guests);

      if (
        !Number.isInteger(guests) ||
        guests < 1 ||
        guests > room.capacity
      ) {
        return {
          success: false,
          error: `This room accommodates between 1 and ${room.capacity} guests.`
        };
      }

      const availability = getRoomAvailability(
        property.id,
        room.id,
        formData.checkIn,
        formData.checkOut
      );

      if (!availability.available) {
        return {
          success: false,
          error: availability.error
        };
      }

      const nights = calculateNights(
        formData.checkIn,
        formData.checkOut
      );

      const total = nights * room.pricePerNight;

      const newBooking = {
        id: Date.now(),
        customerId: customer.id,
        customerName: customer.name,
        propertyId: property.id,
        propertyName: property.name,
        managerId: property.managerId,
        roomId: room.id,
        roomName: room.name,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests,
        nights,
        pricePerNight: room.pricePerNight,
        total,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      setBookings((previous) => [
        ...previous,
        newBooking
      ]);

      return {
        success: true,
        booking: newBooking
      };
    } finally {
      setLoading(false);
    }
  }

  function updateBookingStatus(bookingId, status, managerId) {
    if (!["confirmed", "rejected"].includes(status)) {
      return {
        success: false,
        error: "Invalid booking status."
      };
    }

    const booking = bookings.find(
      (item) => item.id === Number(bookingId)
    );

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    if (booking.managerId !== managerId) {
      return {
        success: false,
        error: "You cannot manage this booking."
      };
    }

    if (booking.status !== "pending") {
      return {
        success: false,
        error: "This booking has already been processed."
      };
    }

    if (status === "confirmed") {
      const property = properties.find(
        (item) => item.id === booking.propertyId
      );

      const room = property?.rooms.find(
        (item) => item.id === booking.roomId
      );

      const otherBookings = bookings.filter((item) => {
        if (item.id === booking.id) {
          return false;
        }

        const sameRoom =
          item.propertyId === booking.propertyId &&
          item.roomId === booking.roomId;

        const active = [
          "pending",
          "confirmed"
        ].includes(item.status);

        const overlaps =
          booking.checkIn < item.checkOut &&
          booking.checkOut > item.checkIn;

        return sameRoom && active && overlaps;
      });

      if (!room || otherBookings.length >= room.totalRooms) {
        return {
          success: false,
          error: "There are no rooms available for this booking."
        };
      }
    }

    setBookings((previous) =>
      previous.map((item) =>
        item.id === Number(bookingId)
          ? {
              ...item,
              status,
              updatedAt: new Date().toISOString()
            }
          : item
      )
    );

    return { success: true };
  }

  function cancelBooking(bookingId, customerId) {
    const booking = bookings.find(
      (item) => item.id === Number(bookingId)
    );

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    if (booking.customerId !== customerId) {
      return {
        success: false,
        error: "You cannot cancel this booking."
      };
    }

    if (booking.status !== "pending") {
      return {
        success: false,
        error: "Only pending bookings can be cancelled."
      };
    }

    setBookings((previous) =>
      previous.map((item) =>
        item.id === Number(bookingId)
          ? {
              ...item,
              status: "cancelled",
              updatedAt: new Date().toISOString()
            }
          : item
      )
    );

    return { success: true };
  }

  const value = {
    properties,
    bookings,
    loading,
    error,
    setError,

    addProperty,
    updateProperty,
    updatePropertyStatus,

    addRoom,
    updateRoom,

    getRoomAvailability,

    createBooking,
    updateBookingStatus,
    cancelBooking,

    setProperties,
    setBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error(
      "useBookings must be used inside BookingProvider."
    );
  }

  return context;
}