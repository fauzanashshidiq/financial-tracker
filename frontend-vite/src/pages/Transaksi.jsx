import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import TransaksiChart from "@/components/TransaksiChart";
import TransaksiTable from "@/components/TransaksiTable";
import { useNavigate } from "react-router-dom";

export default function Transaksi() {
  const navigate = useNavigate();
  const [filterChart, setFilterChart] = useState("Last Month");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transaksi</h1>
        <Button variant="outline" onClick={() => navigate("/transaksi/tambah")}>
          Tambah Transaksi
        </Button>
      </div>

      <TransaksiChart
        filterChart={filterChart}
        setFilterChart={setFilterChart}
      />

      <TransaksiTable
        filterType={filterType}
        setFilterType={setFilterType}
        search={search}
        setSearch={setSearch}
      />
    </DashboardLayout>
  );
}
