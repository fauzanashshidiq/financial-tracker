import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // kalau token gak ada, arahkan ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // kalau ada token, render halamannya
  return children;
};

export default PrivateRoute;
