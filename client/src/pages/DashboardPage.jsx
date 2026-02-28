import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);

  if (user.role !== "admin") {
    return (
      <p className="text-center text-danger mt-10">
        Access Denied: Admins only
      </p>
    );
  }

  return (
    <div className="page-container">
      <h1 className="heading">Admin Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      {/* Admin actions here */}
    </div>
  );
}
