import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactionsByUser } from "../services/transactionService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cek token dan user saat pertama kali load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    console.log("Token dari localStorage:", token);

    if (!token || !storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  // Ambil data transaksi setelah user ter-set
  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await getTransactionsByUser(token);
        setTransactions(Array.isArray(data.data) ? data.data : data);
      } catch (error) {
        console.error("Gagal ambil transaksi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
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
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Transaksi Saya</h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500">Belum ada transaksi.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {transactions.map((trx) => (
                <li key={trx.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-semibold">
                      {trx.description || "(Tanpa deskripsi)"}
                    </p>
                    <p className="text-sm text-gray-500">{trx.date}</p>
                  </div>
                  <p
                    className={`font-semibold ${
                      trx.type === "expense" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {trx.type === "expense" ? "-" : "+"} Rp
                    {trx.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
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
