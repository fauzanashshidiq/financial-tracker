import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function generateDailyData(days) {
  const result = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    result.push({
      date: formatted,
      penghasilan: Math.floor(Math.random() * 1000000 + 500000),
      pengeluaran: Math.floor(Math.random() * 600000 + 200000),
    });
  }

  return result;
}

export default function Transaksi() {
  const [filter, setFilter] = useState("Last Month");

  const getFilteredData = () => {
    switch (filter) {
      case "Last 7 Days":
        return generateDailyData(7);

      case "Last Month":
        return generateDailyData(30);

      case "Last 3 Months":
        return generateDailyData(90);

      case "Last 6 Months":
        return generateDailyData(180);

      case "All Time":
      default:
        return generateDailyData(365);
    }
  };

  const data = getFilteredData();

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transaksi</h1>
        <Button variant="outline">Tambah Transaksi</Button>
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold">Overview Transaksi</h2>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{filter}</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Data</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setFilter("Last 7 Days")}>
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Last Month")}>
                Last Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Last 3 Months")}>
                Last 3 Months
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("Last 6 Months")}>
                Last 6 Months
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("All Time")}>
                All Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="penghasilan" name="Penghasilan" />
              <Bar dataKey="pengeluaran" name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
