import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { getUserById, updateUser } from "@/services/authService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PencilLine } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("");

  const id = JSON.parse(localStorage.getItem("user"))?.id;
  const token = localStorage.getItem("token");

  // Format saldo ke rupiah
  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  // Fetch user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getUserById(id, token);
        setUser(res.data);

        setNewName(res.data.name);
        setNewBalance(res.data.balance);
      } catch (err) {
        console.error(err);
      }
    };
    loadUser();
  }, [id, token]);

  // Handle update (nama + saldo)
  const handleUpdate = async () => {
    try {
      await updateUser(id, {
        name: newName,
        balance: Number(newBalance),
      });

      const updated = {
        ...user,
        name: newName,
        balance: Number(newBalance),
      };

      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));

      setEditOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center mt-2 mb-8 max-w-5xl mx-auto">
          <div className="h-8 w-40 bg-gray-200 rounded mx-auto"></div>
        </div>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200"></div>
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
          </div>

          <div className="mt-6 h-4 w-32 bg-gray-200 rounded"></div>
          <div className="mt-2 h-6 w-1/2 bg-gray-200 rounded"></div>

          <div className="mt-6 h-4 w-20 bg-gray-200 rounded"></div>
          <div className="mt-2 h-6 w-1/3 bg-gray-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mt-2 mb-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center flex-1">Profile</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-3xl mx-auto space-y-6 border">
        {/* Profile Row */}
        <div className="flex items-center justify-between">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@shadcn"
              />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setEditOpen(true)}
          >
            <PencilLine className="mr-1 w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        {/* Email */}
        <div className="pt-4 border-t">
          <p className="text-gray-600 text-sm">Email Address</p>
          <p className="font-medium text-lg">{user.email}</p>
        </div>

        {/* Saldo */}
        <div className="pt-4 border-t">
          <p className="text-gray-600 text-sm">Saldo</p>
          <p className="font-medium text-lg">{formatRupiah(user.balance)}</p>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Nama */}
            <div>
              <label className="text-sm text-gray-600">Nama Baru</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            {/* Saldo */}
            <div>
              <label className="text-sm text-gray-600">Saldo Baru</label>
              <Input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={handleUpdate}>
              Simpan Perubahan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
