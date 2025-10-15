import { Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./utils/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransactions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-transaction"
        element={
          <PrivateRoute>
            <AddTransaction />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
