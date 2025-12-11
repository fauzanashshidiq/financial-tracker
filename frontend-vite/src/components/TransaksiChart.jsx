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

export default function TransaksiChart({
  transactions,
  filterChart,
  setFilterChart,
}) {
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
            <Button size="sm" variant="outline">
              {filterChart}
            </Button>
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
          <BarChart data={chartData} barCategoryGap="25%" barGap={4}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "13px" }} />
            <Bar
              dataKey="penghasilan"
              name="Penghasilan"
              fill="#4ade80"
              barSize={20}
              radius={[5, 5, 0, 0]}
            />
            <Bar
              dataKey="pengeluaran"
              name="Pengeluaran"
              fill="#f87171"
              barSize={20}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
