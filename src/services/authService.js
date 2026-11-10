import { initialMockData } from "../data/mockData";

const STORAGE_KEY = "stayease_users";

function getUsers() {
  const saved = localStorage.getItem(STORAGE_KEY);

  return saved
    ? JSON.parse(saved)
    : initialMockData.users;
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export const authService = {
  async login(email, password) {
    const users = getUsers();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      throw new Error("Incorrect email or password.");
    }

    if (user.status !== "approved") {
      throw new Error("Your account has not been approved.");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };
  },

  async register(formData) {
    const users = getUsers();

    const email = formData.email.trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === email)) {
      throw new Error("This email address is already registered.");
    }

    const user = {
      id: Date.now(),
      name: formData.name.trim(),
      email,
      password: formData.password,
      role: formData.role,
      status: formData.role === "manager" ? "pending" : "approved"
    };

    saveUsers([...users, user]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };
  },

  async logout() {
    return { success: true };
  }
};