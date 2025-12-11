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
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateBudgetRecommendation } from "@/services/aiService";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";

export default function SmartBudget() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(100000);
  const [displayBudget, setDisplayBudget] = useState("");
  const [period, setPeriod] = useState("harian");
  const [needs, setNeeds] = useState([]);
  const [currentCustomNeed, setCurrentCustomNeed] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleGenerate = async () => {
    if (!budget || needs.length === 0) {
      toast.error("Masukkan budget dan pilih minimal 1 kebutuhan!");
      return;
    }

    setLoading(true);
    setAiRecommendation("");

    try {
      const res = await generateBudgetRecommendation(budget, period, needs);
      setAiRecommendation(res.data.recommendation);
    } catch (err) {
      console.error(err);
      console.error("Error API:", err.response?.data || err.message);
      toast.error("Gagal generate rekomendasi AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6 max-w-3xl mx-auto">
        <h1 className="text-3xl mt-2 mb-3 font-bold text-center flex-1 pl-20">
          Budget Assistant
        </h1>
        <Button size="sm" className="ml-4" onClick={() => navigate("history")}>
          <History />
          History
        </Button>
      </div>

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
          <Select value={""} onValueChange={handleAddNeed}>
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
        <Button
          className="mt-4 w-full"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {/* AI Recommendation */}
      {aiRecommendation && (
        <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-inner w-full max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Rekomendasi AI</h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
              strong: ({ node, ...props }) => (
                <strong className="font-bold" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-5 mb-2" {...props} />
              ),
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            }}
          >
            {aiRecommendation}
          </ReactMarkdown>
        </div>
      )}
    </DashboardLayout>
  );
}
