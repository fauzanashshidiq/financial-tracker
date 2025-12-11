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
import DashboardTable from "@/components/DashboardTable";
import { updateUser } from "@/services/authService";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          {/* Title skeleton */}
          <div className="h-8 w-40 bg-gray-200 rounded"></div>

          {/* Progress skeleton */}
          <div className="bg-white p-4 rounded-lg shadow space-y-4 border">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="flex gap-2 items-center">
              <div className="h-4 w-52 bg-gray-200 rounded"></div>
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded ml-auto"></div>
          </div>

          {/* Chart skeleton */}
          <div className="bg-white w-full h-[300px] rounded-lg shadow border"></div>

          {/* Table skeleton */}
          <div className="bg-white rounded-lg shadow border p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex justify-between py-3 border-b last:border-0"
              >
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return <DashboardLayout>User tidak ditemukan.</DashboardLayout>;

  // Semua transaksi untuk chart & progress
  const allTransactions = transactions;

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

  const handleSaveBalance = async () => {
    try {
      const token = localStorage.getItem("token");

      await updateUser(
        user.id,
        {
          balance: Number(newBalance),
        },
        token
      );

      // Update state
      const updated = {
        ...user,
        balance: Number(newBalance),
      };

      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));

      setOpenDialog(false);
    } catch (err) {
      console.error(err);
      alert("Gagal update balance");
    }
  };

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
      <DashboardTable transactions={transactions} categories={categories} />
    </DashboardLayout>
  );
}
