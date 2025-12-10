import React, { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getTransactionsByUser } from "@/services/transactionService";

export default function TransaksiChart({ filterChart, setFilterChart }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactionsByUser();
        setTransactions(res.data || []);
      } catch (err) {
        console.error("Gagal memuat transaksi:", err);
      }
    };
    fetchTransactions();
  }, []);

  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    const dataMap = {};
    const now = new Date();

    let days = 30;
    if (filterChart === "Last 7 Days") days = 7;
    if (filterChart === "Last 3 Months") days = 90;
    if (filterChart === "Last 6 Months") days = 180;
    if (filterChart === "All Time") days = 365;

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (diff <= days) {
        const key = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (!dataMap[key])
          dataMap[key] = { date: key, penghasilan: 0, pengeluaran: 0 };
        if (t.type === "income") dataMap[key].penghasilan += t.amount;
        else dataMap[key].pengeluaran += t.amount;
      }
    });

    return Object.values(dataMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, filterChart]);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Overview Transaksi</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{filterChart}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter Data</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              "Last 7 Days",
              "Last Month",
              "Last 3 Months",
              "Last 6 Months",
              "All Time",
            ].map((f) => (
              <DropdownMenuItem key={f} onClick={() => setFilterChart(f)}>
                {f}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="penghasilan" name="Penghasilan" fill="#4ade80" />
            <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
