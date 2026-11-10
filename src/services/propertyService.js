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

export const propertyService = {
  async getAll() {
    return getProperties();
  },

  async getApproved() {
    return getProperties().filter(
      (property) => property.status === "approved"
    );
  },

  async getById(propertyId) {
    const property = getProperties().find(
      (item) => item.id === Number(propertyId)
    );

    if (!property) {
      throw new Error("Property not found.");
    }

    return property;
  },

  async create(propertyData) {
    const properties = getProperties();

    const property = {
      ...propertyData,
      id: Date.now(),
      status: "pending",
      rooms: [],
      createdAt: new Date().toISOString()
    };

    saveProperties([...properties, property]);

    return property;
  },

  async update(propertyId, updates) {
    const properties = getProperties();

    const exists = properties.some(
      (item) => item.id === Number(propertyId)
    );

    if (!exists) {
      throw new Error("Property not found.");
    }

    const updated = properties.map((item) =>
      item.id === Number(propertyId)
        ? { ...item, ...updates }
        : item
    );

    saveProperties(updated);

    return updated.find(
      (item) => item.id === Number(propertyId)
    );
  }
};