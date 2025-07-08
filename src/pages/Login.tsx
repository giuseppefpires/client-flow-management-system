
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { isAuthenticated } = useAuth();

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect to new auth page
  return <Navigate to="/auth" replace />;
};

export default Login;
