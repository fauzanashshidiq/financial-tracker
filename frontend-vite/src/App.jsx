import { Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import RegisterPage from "@/pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/login" element={<Login />} />
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
      /> */}
    </Routes>
  );
}

export default App;
