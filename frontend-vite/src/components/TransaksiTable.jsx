import React, { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactionsByUser } from "@/services/transactionService";
import { getCategories } from "@/services/categoryService";

export default function TransaksiTable({
  filterType,
  setFilterType,
  search,
  setSearch,
}) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTrans = await getTransactionsByUser();
        setTransactions(resTrans.data || []);
        const resCat = await getCategories();
        setCategories(resCat.data || []);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    };
    fetchData();
  }, []);

  const transactionsWithCategory = useMemo(
    () =>
      transactions.map((t) => ({
        ...t,
        category_name:
          categories.find((c) => c.id === t.category_id)?.name || "-",
      })),
    [transactions, categories]
  );

  const filteredTransactions = useMemo(
    () =>
      transactionsWithCategory.filter((t) => {
        const matchSearch =
          t.description?.toLowerCase().includes(search.toLowerCase()) ||
          t.category_name?.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType ? t.type === filterType : true;
        return matchSearch && matchType;
      }),
    [transactionsWithCategory, search, filterType]
  );

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            ref={(el) =>
              el && (el.indeterminate = table.getIsSomePageRowsSelected())
            }
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
          />
        ),
      },
      { accessorKey: "category_name", header: "Kategori" },
      {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => row.getValue("description") || "Tidak ada deskripsi",
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tanggal <ArrowUpDown />
          </Button>
        ),
      },
      {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) =>
          row.getValue("type") === "income" ? "Penghasilan" : "Pengeluaran",
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Jumlah</div>,
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {row.getValue("type") === "income" ? "+" : "-"}{" "}
            {new Intl.NumberFormat("id-ID").format(row.getValue("amount"))}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.id)}
              >
                Salin ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Lihat detail</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredTransactions,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Cari kategori atau deskripsi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {filterType === "income"
                ? "Penghasilan"
                : filterType === "expense"
                ? "Pengeluaran"
                : "Semua Tipe"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter Tipe</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilterType("")}>
              Semua
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("income")}>
              Penghasilan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("expense")}>
              Pengeluaran
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada transaksi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
