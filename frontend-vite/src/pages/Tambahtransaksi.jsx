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
import {
  createTransaction,
  updateTransaction,
} from "@/services/transactionService";
import { useNavigate, useLocation } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function TambahTransaksi() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [displayJumlah, setDisplayJumlah] = useState("");
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const location = useLocation();
  const editingTransaction = location.state?.transaction;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const localToday = `${yyyy}-${mm}-${dd}`;

  const [tanggal, setTanggal] = useState(
    editingTransaction ? editingTransaction.date : localToday
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategories();
        setAllCategories(res.data);

        if (editingTransaction) {
          setType(editingTransaction.type);
          setJumlah(editingTransaction.amount);
          setDisplayJumlah(
            new Intl.NumberFormat("id-ID").format(editingTransaction.amount)
          );
          setKategori(String(editingTransaction.category_id));
          setTanggal(editingTransaction.date);
          setDeskripsi(editingTransaction.description || "");
        }
      } catch (error) {
        console.error("Gagal memuat kategori", error);
        toast.error("Gagal memuat kategori");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editingTransaction]);

  // Format angka
  const formatNumber = (value) =>
    !value ? "" : new Intl.NumberFormat("id-ID").format(value);

  const handleJumlahChange = (e) => {
    const raw = e.target.value.replace(/\./g, "");
    if (!/^\d*$/.test(raw)) return;
    setJumlah(raw);
    setDisplayJumlah(formatNumber(raw));
  };

  const filteredCategories = allCategories.filter((cat) => cat.type === type);

  const handleTypeChange = (value) => {
    setType(value);
    setKategori("");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;

  const handleConfirmSubmit = async () => {
    if (!type || !jumlah || !kategori || !tanggal) {
      toast.error("Semua field wajib diisi!");
      setOpenDialog(false);
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
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload);
        toast.success("Transaksi berhasil diperbarui!");
      } else {
        await createTransaction(payload);
        toast.success("Transaksi berhasil disimpan!");
      }
      setOpenDialog(false);
      setTimeout(() => navigate("/transaksi"), 1500);
    } catch (err) {
      console.error("Gagal menyimpan transaksi:", err.response?.data || err);
      toast.error("Gagal menyimpan transaksi");
      setOpenDialog(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center w-full">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mt-2 mb-8"></div>

          <div className="border rounded-2xl p-8 bg-white shadow-sm w-full max-w-xl animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-10 w-full bg-gray-200 rounded mb-6"></div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-10 w-full bg-gray-200 rounded mb-6"></div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-10 w-full bg-gray-200 rounded mb-6"></div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-24 w-full bg-gray-200 rounded mb-6"></div>

            <div className="flex gap-3">
              <div className="h-10 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-10 w-1/2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold mt-2 mb-8 text-center">
          {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
        </h1>

        <div className="border rounded-2xl p-8 bg-white shadow-sm w-full max-w-xl">
          <div className="mb-4">
            <Label>Type</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih tipe transaksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Penghasilan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <div className="mb-4">
            <Label className="mb-2 block">Tanggal</Label>
            <Calender28
              value={tanggal}
              onChange={(dateStr) => setTanggal(dateStr)}
            />
          </div>

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

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
              <AlertDialogTrigger asChild>
                <Button className="w-1/2" onClick={() => setOpenDialog(true)}>
                  {editingTransaction ? "Update Transaksi" : "Simpan Transaksi"}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Simpan</AlertDialogTitle>
                </AlertDialogHeader>
                <p>Apakah Anda yakin ingin menyimpan transaksi ini?</p>
                <AlertDialogFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleConfirmSubmit}>Simpan</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
