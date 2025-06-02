import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../store";

export default function ProtectedRoute() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
