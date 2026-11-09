export const mockUsers = [
  { id: "usr-1", name: "Admin User", email: "admin@stayease.com", role: "admin" },
  { id: "usr-2", name: "Jane Manager", email: "manager@stayease.com", role: "manager", isApproved: true },
  { id: "usr-3", name: "John Doe", email: "customer@stayease.com", role: "customer" },
];

export const mockProperties = [
  {
    id: "prop-101",
    managerId: "usr-2",
    title: "Oceanfront Palms Resort",
    location: "Mombasa",
    description: "Beautiful beachfront resort with full amenities.",
    status: "approved",
    image: "https://via.placeholder.com/400x250",
    rooms: [
      { id: "rm-1", name: "Deluxe Sea View", price: 120, capacity: 2, available: true },
      { id: "rm-2", name: "Executive Suite", price: 250, capacity: 4, available: true }
    ]
  }
];

export const mockBookings = [
  {
    id: "bk-1",
    propertyId: "prop-101",
    roomId: "rm-1",
    customerId: "usr-3",
    customerName: "John Doe",
    checkIn: "2026-12-01",
    checkOut: "2026-12-05",
    totalPrice: 480,
    status: "confirmed"
  }
];