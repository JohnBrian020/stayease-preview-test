const STORAGE_KEY = "stayease_properties";

function getProperties() {
  const saved = localStorage.getItem(STORAGE_KEY);

  return saved ? JSON.parse(saved) : [];
}

function saveProperties(properties) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(properties)
  );
}

export const roomService = {
  async getByProperty(propertyId) {
    const property = getProperties().find(
      (item) => item.id === Number(propertyId)
    );

    if (!property) {
      throw new Error("Property not found.");
    }

    return property.rooms || [];
  },

  async create(propertyId, roomData) {
    const properties = getProperties();

    const property = properties.find(
      (item) => item.id === Number(propertyId)
    );

    if (!property) {
      throw new Error("Property not found.");
    }

    const room = {
      id: Date.now(),
      propertyId: property.id,
      name: roomData.name.trim(),
      description: roomData.description || "",
      pricePerNight: Number(roomData.pricePerNight),
      capacity: Number(roomData.capacity),
      totalRooms: Number(roomData.totalRooms),
      available: true
    };

    const updated = properties.map((item) =>
      item.id === property.id
        ? {
            ...item,
            rooms: [...(item.rooms || []), room]
          }
        : item
    );

    saveProperties(updated);

    return room;
  }
};