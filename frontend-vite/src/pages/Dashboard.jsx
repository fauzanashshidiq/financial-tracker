import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { getUserById } from "@/services/authService";
import { getTransactionsByUser } from "@/services/transactionService";
import { Button } from "@/components/ui/button";
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
import { PencilIcon } from "lucide-react";
import DashboardChart from "@/components/DashboardChart";
import { getCategories } from "@/services/categoryService";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("today");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Dialog edit balance
  const [openDialog, setOpenDialog] = useState(false);
  const [newBalance, setNewBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser)
          throw new Error("User tidak ditemukan. Silakan login kembali.");

        const userId = storedUser.id;

        const [resUser, resTx, resCat] = await Promise.all([
          getUserById(userId, token),
          getTransactionsByUser(token),
          getCategories(),
        ]);

        setUser(resUser.data);
        setTransactions(resTx.data || []);
        setCategories(resCat.data || []);
        setNewBalance(resUser.data.balance || 0);
      } catch (err) {
        console.error(err);
        alert(err.message || "Gagal memuat data. Silakan login ulang.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;
  if (!user) return <DashboardLayout>User tidak ditemukan.</DashboardLayout>;

  // Filter transaksi
  const now = new Date();
  // Semua transaksi untuk chart & progress
  const allTransactions = transactions;

  // Transaksi yang difilter untuk list
  const filteredTransactions = transactions.filter((tx) => {
    if (!tx.created_at) return false;

    const txDate = new Date(tx.created_at.substring(0, 23));
    if (isNaN(txDate)) return false;

    if (filter === "today") {
      return (
        txDate.getDate() === now.getDate() &&
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    } else if (filter === "week") {
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - now.getDay());
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      return txDate >= firstDayOfWeek && txDate <= lastDayOfWeek;
    } else if (filter === "month") {
      return (
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  // Total income & expense untuk chart/progress
  const totalIncome = allTransactions
    .filter((tx) => tx.type?.toLowerCase() === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = allTransactions
    .filter((tx) => tx.type?.toLowerCase() === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalAvailable = (user.balance || 0) + totalIncome;
  const spentPercentage = totalAvailable
    ? Math.min((totalExpense / totalAvailable) * 100, 100)
    : 0;

  const handleSaveBalance = () => {
    setUser({ ...user, balance: Number(newBalance) });
    setOpenDialog(false);
  };
  console.log("filteredTransactions", filteredTransactions);
  console.log("user", user);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Progress bar Pengeluaran */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 relative">
        <p className="font-medium text-gray-700 pr-1">Budget Anda</p>
        <div className="flex justify-left items-center mb-2">
          <p className="text-sm text-gray-500 pr-1">
            {totalExpense.toLocaleString("id-ID")} dari{" "}
            {totalAvailable.toLocaleString("id-ID")} terpakai
          </p>
          <Button size="sm" variant="ghost" onClick={() => setOpenDialog(true)}>
            <PencilIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="h-4 rounded-full transition-all duration-500"
            style={{
              width: `${spentPercentage}%`,
              backgroundColor: `rgb(${Math.min(
                spentPercentage * 2.5,
                255
              )}, 0, 0)`,
            }}
          ></div>
        </div>

        <p className="text-right mt-1 text-sm font-medium text-gray-600">
          {spentPercentage.toFixed(1)}% terpakai
        </p>

        {/* Dialog Edit Balance */}
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Balance</AlertDialogTitle>
              <AlertDialogDescription>
                Masukkan saldo baru untuk update total available.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-2">
              <input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="w-full border p-2 rounded-md"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveBalance}>
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <DashboardChart transactions={allTransactions} categories={categories} />

      {/* List transaksi */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-lg">Transaksi Saat Ini</h2>
          <select
            className="border rounded p-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="today">Hari ini</option>
            <option value="week">Minggu ini</option>
            <option value="month">Bulan ini</option>
          </select>
        </div>
        <ul>
          {filteredTransactions.length === 0 && (
            <p className="text-gray-500">Belum ada transaksi</p>
          )}
          {filteredTransactions.map((tx) => (
            <li
              key={tx.id}
              className="flex justify-between border-b py-2 last:border-b-0"
            >
              <span>{tx.description || tx.type}</span>
              <span>Rp {tx.amount.toLocaleString("id-ID")}</span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
