import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTransaction } from "../services/transactionService";

const AddTransaction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "expense",
    category_id: "",
    amount: "",
    description: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction(formData);
      alert("Transaksi berhasil ditambahkan!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Gagal tambah transaksi:", error);
      alert("Gagal menambah transaksi!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Tambah Transaksi
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Jenis Transaksi</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Kategori ID</label>
            <input
              type="text"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Masukkan ID kategori"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Jumlah (Rp)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Masukkan jumlah"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Deskripsi</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Contoh: Beli bahan dapur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tanggal</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
