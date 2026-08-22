import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore, getPostLoginRoute } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  publicOnly?: boolean;
}

export function ProtectedRoute({ children, publicOnly = false }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthStore();

  useEffect(() => {
    if (publicOnly) {
      if (auth.isLoggedIn) {
        navigate(getPostLoginRoute(auth), { replace: true });
      }
      return;
    }

    if (!auth.isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    if (!auth.hasSelectedLocation) {
      if (!location.pathname.includes("/onboarding/location")) {
        navigate("/onboarding/location", { replace: true });
      }
      return;
    }

    if (!auth.hasSeenRights) {
      if (!location.pathname.includes("/onboarding/rights") && !location.pathname.includes("/onboarding/location")) {
        navigate("/onboarding/rights", { replace: true });
      }
    }
  }, [auth.isLoggedIn, auth.hasSelectedLocation, auth.hasSeenRights, publicOnly, navigate, location.pathname, auth]);

  if (!publicOnly && !auth.isLoggedIn) return null;
  if (publicOnly && auth.isLoggedIn) return null;

  return <>{children}</>;
}
