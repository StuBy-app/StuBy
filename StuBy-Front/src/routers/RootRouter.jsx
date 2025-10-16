import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import RequireAuth from "./RequireAuth";
import UserRouter from "./UserRouter";

export default function RootRouter() {
  return (
    <Routes>
      {/* 공개 경로 */}
      <Route path="/auth/*" element={<AuthRoute />} />

      {/* 보호 경로 */}
      <Route element={<RequireAuth />}>
        <Route path="/*" element={<UserRouter />} />
      </Route>

      {/* 첫 진입은 /auth/loading */}
      <Route path="/" element={<Navigate to="/auth/loading" replace />} />
    </Routes>
  );
}
