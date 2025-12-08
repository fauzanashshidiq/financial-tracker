import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi password
    if (!validatePassword(formData.password)) {
      setError(
        "Password minimal 8 karakter dan harus mengandung huruf dan angka."
      );
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Register success:", response.data);

      alert("Pendaftaran berhasil! Silakan login."); // Bisa ganti pakai alert shadcn juga
      navigate("/login");
    } catch (err) {
      const msg =
        "Terjadi kesalahan saat register. Email mungkin sudah digunakan.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-6 shadow-md rounded-xl bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Daftar Akun
        </h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Alamat Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Kata Sandi"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex justify-between gap-4">
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>
              Kembali
            </Button>
            <Button type="submit" size="lg" variant="default">
              Daftar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
