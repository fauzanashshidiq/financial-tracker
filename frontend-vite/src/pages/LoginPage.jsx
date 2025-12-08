import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser(formData);

      // simpan token & user
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // buka dialog sukses
      setOpenDialog(true);
    } catch (err) {
      setError(err.response?.data?.error || "Login gagal. Coba lagi.");
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
          Masuk Akun
        </h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              Masuk
            </Button>
          </div>
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

      {/* Alert Dialog Sukses */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Berhasil!</AlertDialogTitle>
            <AlertDialogDescription>
              Selamat datang! Klik tombol di bawah untuk melanjutkan ke
              dashboard.
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
