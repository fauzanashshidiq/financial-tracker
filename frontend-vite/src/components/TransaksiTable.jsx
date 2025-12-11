import React, { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  PencilLine,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteTransaction } from "@/services/transactionService";
import { useNavigate } from "react-router-dom";

export default function TransaksiTable({
  transactions,
  setTransactions,
  categories,
  filterType,
  setFilterType,
  search,
  setSearch,
}) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransactionIdsToDelete, setSelectedTransactionIdsToDelete] =
    useState([]);

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
        cell: ({ row }) => {
          const dateValue = row.getValue("date");
          if (!dateValue) return "-";
          const date = new Date(dateValue);
          return (
            <div className="pl-4">
              {date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          );
        },
      },
      { accessorKey: "category_name", header: "Kategori" },
      {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => row.getValue("description") || "Tidak ada deskripsi",
      },
      {
        accessorKey: "type",
        header: () => <div className="pl-5">Tipe</div>,
        cell: ({ row }) => {
          const type = row.getValue("type");
          return (
            <span
              className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
                type === "income" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {type === "income" ? "Penghasilan" : "Pengeluaran"}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Jumlah</div>,
        cell: ({ row }) => {
          const amount = row.getValue("amount");
          const type = row.getValue("type");
          return (
            <div
              className={`text-right font-medium ${
                type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {type === "income" ? "+" : "-"} Rp{" "}
              {new Intl.NumberFormat("id-ID").format(amount)}
            </div>
          );
        },
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
                className="cursor-pointer flex items-center gap-2 text-gray-700"
                onClick={() =>
                  navigate("/transaksi/tambah", {
                    state: { transaction: row.original },
                  })
                }
              >
                <PencilLine className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2 text-red-600"
                onClick={() => {
                  setSelectedTransactionIdsToDelete([row.original.id]);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </DropdownMenuItem>
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
    initialState: { pagination: { pageSize: pageSize, pageIndex: 0 } },
  });

  const handleOpenDeleteDialog = () => {
    const ids = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original.id);
    if (!ids.length) return;
    setSelectedTransactionIdsToDelete(ids);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      for (const id of selectedTransactionIdsToDelete) {
        await deleteTransaction(id);
      }
      setTransactions(
        transactions.filter(
          (t) => !selectedTransactionIdsToDelete.includes(t.id)
        )
      );
      setRowSelection({});
      setDeleteDialogOpen(false);

      toast.success(
        `${selectedTransactionIdsToDelete.length} transaksi berhasil dihapus.`
      );
    } catch (err) {
      console.error("Gagal menghapus transaksi:", err);
      setDeleteDialogOpen(false);
      toast.error("Terjadi kesalahan saat menghapus transaksi.");
    }
  };

  return (
    <>
      {/* Search & Filter */}
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Cari kategori atau deskripsi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 text-sm placeholder:text-sm h-8"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
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

        {/* Tombol Hapus Global */}
        {table.getSelectedRowModel().flatRows.length > 0 && (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleOpenDeleteDialog}
          >
            <Trash2 className="w-4 h-4" />
            Hapus ({table.getSelectedRowModel().flatRows.length})
          </Button>
        )}
      </div>

      {/* AlertDialog (selalu dirender) */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
          </AlertDialogHeader>
          <p>
            Apakah Anda yakin ingin menghapus{" "}
            {selectedTransactionIdsToDelete.length} transaksi terpilih?
          </p>
          <AlertDialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Table */}
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
                  className="h-24 text-center text-gray-500"
                >
                  Belum ada transaksi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <span className="mx-2 text-sm">
          Halaman{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
