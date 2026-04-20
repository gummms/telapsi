import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Spinner from "../components/Spinner";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-route-loading">
        <Spinner />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
