const USERS_KEY = "stayease_users";
const PROPERTIES_KEY = "stayease_properties";
const BOOKINGS_KEY = "stayease_bookings";

function readStorage(key) {
  const saved = localStorage.getItem(key);

  return saved ? JSON.parse(saved) : [];
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const adminService = {
  async getManagers() {
    return readStorage(USERS_KEY).filter(
      (user) => user.role === "manager"
    );
  },

  async updateManagerStatus(managerId, status) {
    const users = readStorage(USERS_KEY);

    const updated = users.map((user) =>
      user.id === Number(managerId)
        ? { ...user, status }
        : user
    );

    writeStorage(USERS_KEY, updated);

    return updated.find(
      (user) => user.id === Number(managerId)
    );
  },

  async getProperties() {
    return readStorage(PROPERTIES_KEY);
  },

  async updatePropertyStatus(propertyId, status) {
    const properties = readStorage(PROPERTIES_KEY);

    const updated = properties.map((property) =>
      property.id === Number(propertyId)
        ? { ...property, status }
        : property
    );

    writeStorage(PROPERTIES_KEY, updated);

    return updated.find(
      (property) => property.id === Number(propertyId)
    );
  },

  async getBookings() {
    return readStorage(BOOKINGS_KEY);
  }
};