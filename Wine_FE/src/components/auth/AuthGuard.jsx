import { Navigate, useLocation } from "react-router-dom";
import Loading from "../common/Loading";
import { useAuth } from "../../context/AuthContext";

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen={true}></Loading>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
