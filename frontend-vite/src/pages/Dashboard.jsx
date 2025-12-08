import React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Selamat datang di dashboard!</p>
    </DashboardLayout>
  );
}
