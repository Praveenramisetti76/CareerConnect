import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/userStore";
import { useInitializeAuth } from "@/hooks/useInitializeAuth";
import LodingScreen from "./LodingScreen";

const AuthGuard = ({
  children,
  requireAuth = true,
  redirectTo = "/auth/login",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useInitializeAuth();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      const isAuthenticated = !!token && !!user;

      if (requireAuth && !isAuthenticated) {
        // Save the attempted location for redirect after login
        navigate(redirectTo, {
          state: { from: location.pathname },
          replace: true,
        });
      } else if (!requireAuth && isAuthenticated) {
        // If user is already logged in and tries to access auth pages
        const from = location.state?.from || "/dashboard";
        navigate(redirectTo || from, { replace: true });
      }
    }
  }, [loading, token, user, requireAuth, redirectTo, navigate, location]);

  if (loading) {
    return <LodingScreen />;
  }

  const isAuthenticated = !!token && !!user;

  if (requireAuth && !isAuthenticated) {
    return <LodingScreen />;
  }

  if (!requireAuth && isAuthenticated) {
    return <LodingScreen />;
  }

  return children;
};

export default AuthGuard;
