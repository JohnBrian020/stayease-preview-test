import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { initialMockData } from "../data/mockData";
import {
  validateEmail,
  validatePassword
} from "../utils/validation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("stayease_users");

    return savedUsers
      ? JSON.parse(savedUsers)
      : initialMockData.users;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("stayease_current_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("stayease_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "stayease_current_user",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("stayease_current_user");
    }
  }, [currentUser]);

  function login(email, password) {
    setLoading(true);
    setError("");

    try {
      if (!validateEmail(email)) {
        const message = "Enter a valid email address.";
        setError(message);
        return { success: false, error: message };
      }

      if (!password) {
        const message = "Password is required.";
        setError(message);
        return { success: false, error: message };
      }

      const user = users.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password
      );

      if (!user) {
        const message = "Incorrect email or password.";
        setError(message);
        return { success: false, error: message };
      }

      if (user.status !== "approved") {
        const message = "Your account is waiting for admin approval.";
        setError(message);
        return { success: false, error: message };
      }

      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      };

      setCurrentUser(safeUser);

      return {
        success: true,
        user: safeUser
      };
    } finally {
      setLoading(false);
    }
  }

  function register(formData) {
    setLoading(true);
    setError("");

    try {
      const { name, email, password, role } = formData;

      if (!name?.trim()) {
        const message = "Full name is required.";
        setError(message);
        return { success: false, error: message };
      }

      if (!validateEmail(email)) {
        const message = "Enter a valid email address.";
        setError(message);
        return { success: false, error: message };
      }

      const passwordError = validatePassword(password);

      if (passwordError) {
        setError(passwordError);
        return { success: false, error: passwordError };
      }

      if (!["customer", "manager"].includes(role)) {
        const message = "Choose a valid account type.";
        setError(message);
        return { success: false, error: message };
      }

      const cleanEmail = email.trim().toLowerCase();

      const emailExists = users.some(
        (user) => user.email.toLowerCase() === cleanEmail
      );

      if (emailExists) {
        const message = "An account with this email already exists.";
        setError(message);
        return { success: false, error: message };
      }

      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password,
        role,
        status: role === "manager" ? "pending" : "approved"
      };

      setUsers((previousUsers) => [
        ...previousUsers,
        newUser
      ]);

      return {
        success: true,
        message:
          role === "manager"
            ? "Registration submitted. Wait for admin approval."
            : "Account created successfully. You can now log in."
      };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setCurrentUser(null);
    setError("");
  }

  function updateUserStatus(userId, status) {
    const allowedStatuses = ["pending", "approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return {
        success: false,
        error: "Invalid account status."
      };
    }

    const userExists = users.some(
      (user) => user.id === Number(userId)
    );

    if (!userExists) {
      return {
        success: false,
        error: "User not found."
      };
    }

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === Number(userId)
          ? { ...user, status }
          : user
      )
    );

    return { success: true };
  }

  const value = {
    users,
    currentUser,
    loading,
    error,
    isAuthenticated: Boolean(currentUser),
    login,
    register,
    logout,
    updateUserStatus,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}