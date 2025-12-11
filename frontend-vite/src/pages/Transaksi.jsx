import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import TransaksiChart from "@/components/TransaksiChart";
import TransaksiTable from "@/components/TransaksiTable";
import { useNavigate } from "react-router-dom";
import { getTransactionsByUser } from "@/services/transactionService";
import { getCategories } from "@/services/categoryService";
import { SquarePen } from "lucide-react";

export default function Transaksi() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [filterChart, setFilterChart] = useState("Last Month");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTrans, resCat] = await Promise.all([
          getTransactionsByUser(),
          getCategories(),
        ]);

        setTransactions(resTrans.data || []);
        setCategories(resCat.data || []);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-between mb-4 animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>

        <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse mb-6"></div>

        <div className="bg-white p-4 rounded-xl border animate-pulse">
          <div className="flex gap-4 mb-4">
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>

          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transaksi</h1>
        <Button
          size="sm"
          variant="default"
          onClick={() => navigate("/transaksi/tambah")}
        >
          <SquarePen className="w-4 h-4" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Chart */}
      <TransaksiChart
        transactions={transactions}
        filterChart={filterChart}
        setFilterChart={setFilterChart}
      />

      {/* Table */}
      <TransaksiTable
        transactions={transactions}
        setTransactions={setTransactions}
        categories={categories}
        filterType={filterType}
        setFilterType={setFilterType}
        search={search}
        setSearch={setSearch}
      />
    </DashboardLayout>
  );
}
