import { ChartColumnDecreasing, ChartPie } from "lucide-react";
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function DashboardChart({ transactions, categories }) {
  if (!transactions) return null;

  const transactionsWithCategory = useMemo(
    () =>
      transactions.map((t) => ({
        ...t,
        category_name:
          categories?.find((c) => c.id === t.category_id)?.name || "Lainnya",
      })),
    [transactions, categories]
  );

  // Total income & expense
  const totalIncome = transactionsWithCategory
    .filter((tx) => tx.type?.toLowerCase() === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactionsWithCategory
    .filter((tx) => tx.type?.toLowerCase() === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Group income by category_name
  const incomeCategories = {};
  transactionsWithCategory
    .filter((tx) => tx.type?.toLowerCase() === "income")
    .forEach((tx) => {
      const cat = tx.category_name;
      if (!incomeCategories[cat]) incomeCategories[cat] = 0;
      incomeCategories[cat] += tx.amount;
    });
  const incomeData = Object.entries(incomeCategories).map(([name, value]) => ({
    name,
    value,
  }));

  // Group expense by category_name
  const expenseCategories = {};
  transactionsWithCategory
    .filter((tx) => tx.type?.toLowerCase() === "expense")
    .forEach((tx) => {
      const cat = tx.category_name;
      if (!expenseCategories[cat]) expenseCategories[cat] = 0;
      expenseCategories[cat] += tx.amount;
    });
  const expenseData = Object.entries(expenseCategories).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Warna kategori (tidak termasuk merah & hijau)
  const CATEGORY_COLORS = [
    "#60a5fa", // biru
    "#facc15", // kuning
    "#a78bfa", // ungu
    "#f472b6", // pink
    "#38bdf8", // biru muda
    "#fb923c", // oranye
    "#e879f9", // magenta
    "#22d3ee", // cyan
  ];

  const getCategoryColor = (index) =>
    CATEGORY_COLORS[index % CATEGORY_COLORS.length];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Penghasilan vs Pengeluaran */}
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-center font-medium mb-2">
          Penghasilan vs Pengeluaran
        </p>

        {totalIncome === 0 && totalExpense === 0 ? (
          <div className="w-full h-72 flex flex-col items-center justify-center text-gray-500">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-3">
              <ChartColumnDecreasing />
            </div>
            <p>Belum ada data transaksi untuk ditampilkan</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Pengeluaran", value: totalExpense },
                  { name: "Penghasilan", value: totalIncome },
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={(entry) => `Rp ${entry.value.toLocaleString("id-ID")}`}
              >
                <Cell fill="#f87171" />
                <Cell fill="#4ade80" />
              </Pie>
              <Legend verticalAlign="bottom" align="center" height={36} />
              <Tooltip
                formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Penghasilan per kategori */}
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-center font-medium mb-2">Penghasilan per Kategori</p>

        {incomeData.length === 0 ? (
          <div className="w-full h-72 flex flex-col items-center justify-center text-gray-500">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-3">
              <ChartPie />
            </div>
            <p>Belum ada data penghasilan untuk ditampilkan</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ value }) => `Rp ${value.toLocaleString("id-ID")}`}
              >
                {incomeData.map((entry, index) => (
                  <Cell key={index} fill={getCategoryColor(index)} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" align="center" height={36} />
              <Tooltip
                formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pengeluaran per kategori */}
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-center font-medium mb-2">Pengeluaran per Kategori</p>

        {expenseData.length === 0 ? (
          <div className="w-full h-72 flex flex-col items-center justify-center text-gray-500">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-3">
              <ChartPie />
            </div>
            <p>Belum ada data pengeluaran untuk ditampilkan</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ value }) => `Rp ${value.toLocaleString("id-ID")}`}
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={getCategoryColor(index + incomeData.length)}
                  />
                ))}
              </Pie>

              <Legend verticalAlign="bottom" align="center" height={36} />
              <Tooltip
                formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
