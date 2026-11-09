
import { createContext, useContext, useState } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockUsers[2]); // Customer default for dev UI testing

  const login = (email, role) => {
    const foundUser = mockUsers.find(u => u.email === email) || { id: "usr-temp", name: email, email, role };
    setUser(foundUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);