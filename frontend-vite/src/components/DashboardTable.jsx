import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DashboardTable({ transactions, categories }) {
  const [filterPeriod, setFilterPeriod] = useState("today");

  // Tambahkan category_name ke transaksi
  const transactionsWithCategory = useMemo(() => {
    if (!transactions) return [];
    return transactions.map((tx) => ({
      ...tx,
      category_name:
        categories.find((c) => c.id === tx.category_id)?.name || "-",
    }));
  }, [transactions, categories]);

  const filteredTransactions = useMemo(() => {
    if (!transactionsWithCategory) return [];

    const now = new Date();

    return transactionsWithCategory.filter((tx) => {
      if (!tx.created_at) return false;
      const txDate = new Date(tx.created_at.substring(0, 23));

      if (filterPeriod === "today") {
        return (
          txDate.getDate() === now.getDate() &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      } else if (filterPeriod === "week") {
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        return txDate >= firstDayOfWeek && txDate <= lastDayOfWeek;
      } else if (filterPeriod === "month") {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  }, [transactionsWithCategory, filterPeriod]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg">Transaksi Saat Ini</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {filterPeriod === "today"
                ? "Hari ini"
                : filterPeriod === "week"
                ? "Minggu ini"
                : "Bulan ini"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter Periode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilterPeriod("today")}>
              Hari ini
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterPeriod("week")}>
              Minggu ini
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterPeriod("month")}>
              Bulan ini
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                Belum ada transaksi
              </TableCell>
            </TableRow>
          ) : (
            filteredTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  {tx.created_at
                    ? new Date(tx.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </TableCell>
                <TableCell>{tx.category_name}</TableCell>
                <TableCell>{tx.description || "Tidak ada deskripsi"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
                      tx.type === "income" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {tx.type === "income" ? "Penghasilan" : "Pengeluaran"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span
                    className={
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {tx.type === "income" ? "+" : "-"} Rp{" "}
                    {tx.amount.toLocaleString("id-ID")}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
