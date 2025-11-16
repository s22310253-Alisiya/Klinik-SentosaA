import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { isAuthorized } from "@/lib/auth";

type ProtectedRouteProps = {
  allowedRoles: string[] | string;
  children: React.ReactElement;
};

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const ok = isAuthorized(allowedRoles);
  if (!ok) {
    toast.error("Akses ditolak: Anda tidak memiliki izin untuk halaman ini.");
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
