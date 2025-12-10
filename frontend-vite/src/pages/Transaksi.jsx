import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import TransaksiChart from "@/components/TransaksiChart";
import TransaksiTable from "@/components/TransaksiTable";
import { useNavigate } from "react-router-dom";
import { getTransactionsByUser } from "@/services/transactionService";
import { getCategories } from "@/services/categoryService";

export default function Transaksi() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [filterChart, setFilterChart] = useState("Last Month");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

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
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transaksi</h1>
        <Button variant="outline" onClick={() => navigate("/transaksi/tambah")}>
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
