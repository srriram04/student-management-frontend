import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const BASE_URL = "https://student-management-backend-3dbc.onrender.com";

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ================= LOAD USER =================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  // ================= LOGIN =================
  const login = async (role, identifier, password) => {

    let userData = null;

    try {

      // ================= STUDENT LOGIN =================
      if (role === "student") {

        const res = await axios.post(`${BASE_URL}/student_login/`, {
          roll_no: identifier,
          date_of_birth: password,
        });

        userData = {
          id: res.data.roll_no,
          name: res.data.name,
          role: "student",
          roll_no: res.data.roll_no,
        };
      }

      // ================= ADMIN LOGIN (UPDATED) =================
      else if (role === "admin") {

        const res = await axios.post(`${BASE_URL}/sign_in/`, {
          email: identifier,
          password: password,
        });

        userData = {
          id: res.data.id,
          name: res.data.name,
          role: "admin",
          email: res.data.email,
        };
      }

      // ================= SAVE USER =================
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", "mock-token");

      return userData;

    } catch (err) {

      console.error("Login Error:", err.response?.data || err.message);

      throw new Error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ================= HOOK =================
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };