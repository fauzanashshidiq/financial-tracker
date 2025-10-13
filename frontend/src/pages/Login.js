import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser(formData);
      console.log("Login success:", response.data);

      // Simpan token ke localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login berhasil!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login gagal. Coba lagi.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-xl bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Masuk Akun</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Alamat Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Kata Sandi"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Masuk
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Belum punya akun?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Daftar di sini
        </span>
      </p>
    </div>
  );
};

export default Login;
