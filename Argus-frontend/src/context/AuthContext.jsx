import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import * as authService from "../api/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 const fetchProfile = async () => {
  try {
    const { data } = await api.get("profile/");
    setUser(data);
    return data;
  } catch (err) {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    await authService.login(username, password);
    await fetchProfile();
  };

const register = async (userData) => {
  await authService.register(userData);
  await login(userData.username, userData.password);
};
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, logout, refreshUser: fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);