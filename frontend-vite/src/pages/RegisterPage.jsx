import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!validatePassword(formData.password)) {
      setError(
        "Password minimal 8 karakter dan harus mengandung huruf dan angka."
      );
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Register success:", response.data);

      // simpan token dan user ke localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // buka alert dialog sukses
      setOpenDialog(true);
    } catch (err) {
      setError(
        "Terjadi kesalahan saat register. Email mungkin sudah digunakan."
      );
    }
  };

  const handleDialogConfirm = () => {
    setOpenDialog(false);
    navigate("/dashboard");
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
          {/* Nama */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Alamat Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Alamat Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password + Toggle Eye */}
          <div className="flex flex-col gap-1 relative">
            <Label htmlFor="password">Kata Sandi</Label>

            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Kata Sandi"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 mt-2">
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>
              Kembali
            </Button>
            <Button type="submit" size="lg">
              Daftar
            </Button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>

      {/* Alert Dialog Sukses */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pendaftaran Berhasil!</AlertDialogTitle>
            <AlertDialogDescription>
              Selamat! Akun kamu sudah dibuat. Klik tombol di bawah untuk masuk
              ke dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogConfirm}>
              Lanjut
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
