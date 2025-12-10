import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SmartBudget() {
  const [budget, setBudget] = useState(100000); // default 100000
  const [displayBudget, setDisplayBudget] = useState("100.000"); // tampilan
  const [period, setPeriod] = useState("harian");
  const [needs, setNeeds] = useState([]); // multi select
  const [currentCustomNeed, setCurrentCustomNeed] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState("");

  const needOptions = ["Makanan", "Transportasi", "Hiburan", "Kesehatan"];

  const formatNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const handleBudgetChange = (e) => {
    const raw = e.target.value.replace(/\./g, "");
    if (!/^\d*$/.test(raw)) return;
    setBudget(Number(raw));
    setDisplayBudget(formatNumber(raw));
  };

  const handleAddNeed = (val) => {
    if (!needs.includes(val)) setNeeds([...needs, val]);
  };

  const handleRemoveNeed = (val) => {
    setNeeds(needs.filter((n) => n !== val));
  };

  const handleAddCustomNeed = () => {
    const trimmed = currentCustomNeed.trim();
    if (!trimmed) return;
    setNeeds([...needs, trimmed]);
    setCurrentCustomNeed("");
  };

  const handleGenerate = () => {
    setAiRecommendation(
      `Rekomendasi untuk ${needs.join(
        ", "
      )} selama ${period} dengan budget Rp ${formatNumber(budget)}: ...`
    );
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mt-2 mb-8 text-center">
        Budget Assistant
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-3xl mx-auto space-y-4 border">
        {/* Budget */}
        <div>
          <Label>Budget (Rp)</Label>
          <Input
            className="mt-1"
            type="text"
            placeholder="Masukkan jumlah budget"
            value={displayBudget}
            onChange={handleBudgetChange}
          />
        </div>

        {/* Periode */}
        <div>
          <Label>Periode</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="harian">Harian</SelectItem>
              <SelectItem value="mingguan">Mingguan</SelectItem>
              <SelectItem value="bulanan">Bulanan</SelectItem>
              <SelectItem value="tahunan">Tahunan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kebutuhan Multi-select */}
        <div>
          <Label>Kebutuhan</Label>
          <Select
            value={""} // dummy karena pakai klik manual
            onValueChange={handleAddNeed}
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Pilih kebutuhan" />
            </SelectTrigger>
            <SelectContent>
              {needOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Input custom kebutuhan */}
          <div className="mt-2 flex gap-2">
            <Input
              placeholder="Masukkan kebutuhan lain"
              value={currentCustomNeed}
              onChange={(e) => setCurrentCustomNeed(e.target.value)}
            />
            <Button onClick={handleAddCustomNeed}>Tambah</Button>
          </div>

          {/* List kebutuhan terpilih */}
          {needs.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {needs.map((n, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 text-sm flex items-center gap-1"
                >
                  {n}
                  <button
                    className="text-red-500 font-bold"
                    onClick={() => handleRemoveNeed(n)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Generate */}
        <Button className="mt-4 w-full" onClick={handleGenerate}>
          Generate
        </Button>
      </div>

      {/* AI Recommendation */}
      {aiRecommendation && (
        <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-inner w-full max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Rekomendasi AI</h2>
          <p>{aiRecommendation}</p>
        </div>
      )}
    </DashboardLayout>
  );
}
