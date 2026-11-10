const STORAGE_KEY = "stayease_bookings";

function getBookings() {
  const saved = localStorage.getItem(STORAGE_KEY);

  return saved ? JSON.parse(saved) : [];
}

function saveBookings(bookings) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(bookings)
  );
}

export const bookingService = {
  async getAll() {
    return getBookings();
  },

  async getByCustomer(customerId) {
    return getBookings().filter(
      (booking) => booking.customerId === Number(customerId)
    );
  },

  async getByManager(managerId) {
    return getBookings().filter(
      (booking) => booking.managerId === Number(managerId)
    );
  },

  async create(bookingData) {
    const bookings = getBookings();

    const booking = {
      ...bookingData,
      id: Date.now(),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    saveBookings([...bookings, booking]);

    return booking;
  },

  async updateStatus(bookingId, status) {
    const bookings = getBookings();

    const bookingExists = bookings.some(
      (item) => item.id === Number(bookingId)
    );

    if (!bookingExists) {
      throw new Error("Booking not found.");
    }

    const updated = bookings.map((item) =>
      item.id === Number(bookingId)
        ? {
            ...item,
            status,
            updatedAt: new Date().toISOString()
          }
        : item
    );

    saveBookings(updated);

    return updated.find(
      (item) => item.id === Number(bookingId)
    );
  }
};