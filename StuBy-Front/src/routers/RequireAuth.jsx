import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function RequireAuth() {
  const token = localStorage.getItem("AccessToken");
  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
