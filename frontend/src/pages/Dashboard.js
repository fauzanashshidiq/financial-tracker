import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cek token dan user di localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">FinTrack Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      {/* Konten utama */}
      <main className="flex-1 container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-2">
          Selamat datang, {user.name}! 👋
        </h2>
        <p className="text-gray-600 mb-6">
          Email kamu: <span className="font-medium">{user.email}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold text-blue-600">
              Total Transaksi
            </h3>
            <p className="text-3xl font-bold mt-2">Rp 0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold text-blue-600">
              Kategori Tersimpan
            </h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold text-blue-600">
              Sisa Anggaran
            </h3>
            <p className="text-3xl font-bold mt-2">Rp 0</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-3 text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} FinTrack. Semua hak dilindungi.
      </footer>
    </div>
  );
};

export default Dashboard;
