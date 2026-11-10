import { users } from "./users";
import { properties } from "./properties";
import { rooms } from "./rooms";
import { bookings } from "./bookings";

export const initialMockData = {
  users,
  properties: properties.map((property) => ({
    ...property,

    rooms: rooms.filter(
      (room) => room.propertyId === property.id
    )
  })),
  bookings
};