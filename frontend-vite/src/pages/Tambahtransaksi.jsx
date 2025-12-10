import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getCategories } from "@/services/categoryService";
import { Calender28 } from "@/components/Calender28";
import { createTransaction } from "@/services/transactionService";
import { useNavigate } from "react-router-dom";

export default function TambahTransaksi() {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [displayJumlah, setDisplayJumlah] = useState("");
  const [kategori, setKategori] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  const formatNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const handleJumlahChange = (e) => {
    const raw = e.target.value.replace(/\./g, "");
    if (!/^\d*$/.test(raw)) return;

    setJumlah(raw);
    setDisplayJumlah(formatNumber(raw));
  };

  // Load categories dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategories();
        setAllCategories(res.data);
      } catch (error) {
        console.error("Gagal memuat kategori", error);
      }
    };
    fetchData();
  }, []);

  // Filter kategori sesuai type
  const filteredCategories = allCategories.filter((cat) => cat.type === type);

  // Reset kategori ketika type berubah
  const handleTypeChange = (value) => {
    setType(value);
    setKategori("");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;

  const handleSubmit = async () => {
    if (!type || !jumlah || !kategori || !tanggal) {
      alert("Semua field wajib diisi!");
      return;
    }

    const formattedDate = new Date(tanggal).toISOString().split("T")[0];

    const payload = {
      user_id,
      type,
      amount: Number(jumlah),
      category_id: kategori,
      date: formattedDate,
      description: deskripsi,
    };

    try {
      await createTransaction(payload);
      navigate("/transaksi");
    } catch (err) {
      console.error("Gagal menyimpan transaksi:", err.response?.data || err);
      alert("Gagal menyimpan transaksi");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center w-full">
        {/* Judul di tengah */}
        <h1 className="text-3xl font-bold mt-2 mb-8 text-center">
          Tambah Transaksi
        </h1>

        {/* CARD FORM */}
        <div className="border rounded-2xl p-8 bg-white shadow-sm w-full max-w-xl">
          {/* TYPE */}
          <div className="mb-4">
            <Label>Type</Label>
            <Select onValueChange={handleTypeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih tipe transaksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Penghasilan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* JUMLAH */}
          <div className="mb-4">
            <Label>Jumlah</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Masukkan jumlah..."
              className="mt-1"
              value={displayJumlah}
              onChange={handleJumlahChange}
            />
          </div>

          {/* KATEGORI */}
          <div className="mb-4">
            <Label>Kategori</Label>
            <Select
              value={kategori}
              onValueChange={setKategori}
              disabled={!type}
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={!type ? "Pilih type dulu" : "Pilih kategori"}
                />
              </SelectTrigger>

              <SelectContent>
                {filteredCategories.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Tidak ada kategori
                  </SelectItem>
                ) : (
                  filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* TANGGAL (shadcn Calender28) */}
          <div className="mb-4">
            <Label className="mb-2 block">Tanggal</Label>
            <Calender28 onChange={(dateStr) => setTanggal(dateStr)} />
          </div>

          {/* DESKRIPSI */}
          <div className="mb-4">
            <Label>Deskripsi</Label>
            <Textarea
              className="mt-1"
              placeholder="Tambahkan catatan..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => navigate("/transaksi")}
            >
              Batal
            </Button>
            <Button className="w-1/2" onClick={handleSubmit}>
              Simpan Transaksi
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
