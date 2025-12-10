import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="text-center max-w-3xl space-y-6">
        {/* Judul */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          Kelola Keuangan Anda dengan Mudah
        </h1>

        {/* Deskripsi */}
        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">
          Lacak pendapatan, pengeluaran, dan tabungan Anda di satu tempat.
          FinTrack membuat penganggaran menjadi mudah dan cepat.
        </p>

        {/* Tombol CTA */}
        <div className="flex justify-center gap-4 mt-4">
          <Button size="lg" variant="default">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
