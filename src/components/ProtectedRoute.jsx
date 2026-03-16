import { useUser } from "../context/UserData";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading || user === undefined) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/" />;
};
export default ProtectedRoute;