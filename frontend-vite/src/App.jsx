import { Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import PrivateRoute from "@/utils/PrivateRoute";
import Transaksi from "./pages/Transaksi";
import TambahTransaksi from "./pages/Tambahtransaksi";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/transaksi"
        element={
          <PrivateRoute>
            <Transaksi />
          </PrivateRoute>
        }
      />
      <Route
        path="/transaksi/tambah"
        element={
          <PrivateRoute>
            <TambahTransaksi />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
