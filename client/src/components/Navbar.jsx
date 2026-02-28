import authService from "../services/api";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout} = useContext(AuthContext);

const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken"); // ⚠ must pass
      if (!refreshToken) throw new Error("No refresh token found");

      await authService.logout(refreshToken); // send token to backend
      logout(); // clear frontend auth state
    } catch (err) {
      console.log("Logout failed", err);
    }
  };


  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-500">Authentication</h1>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hi, {user.name}</span>
            <button className="btn-primary px-4 py-1" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login" className="btn-primary px-4 py-1 mr-2">Login</a>
            <a href="/register" className="btn-secondary px-4 py-1">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}