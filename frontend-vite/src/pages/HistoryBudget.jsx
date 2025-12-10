import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getRecommendationsByUser,
  deleteRecommendation,
} from "@/services/aiService";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getRecommendationsByUser();
      // ambil array recommendations dari response
      setHistory(
        (res.data?.recommendations || []).map((r) => ({
          ...r,
          recommendation_text: r.recommendation_text || "",
        }))
      );
    } catch (err) {
      console.error(
        "Error fetching history:",
        err.response?.data || err.message
      );
      toast.error("Gagal memuat history AI");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRecommendation(id);
      toast.success("Rekomendasi berhasil dihapus");
      fetchHistory();
    } catch (err) {
      console.error(
        "Error deleting recommendation:",
        err.response?.data || err.message
      );
      toast.error("Gagal menghapus rekomendasi");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">History Rekomendasi Budget</h1>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && history.length === 0 && (
        <p className="text-gray-500">Belum ada riwayat rekomendasi.</p>
      )}

      <div className="space-y-2 border px-4">
        <Accordion type="single" collapsible>
          {history.map((item) => (
            <AccordionItem
              key={item.recommendation_id}
              value={item.recommendation_id}
            >
              <AccordionTrigger>
                <span>
                  {new Date(item.created_at).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    dateStyle: "long",
                    timeStyle: "short",
                  })}{" "}
                  WIB
                </span>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-2" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 mb-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                  }}
                >
                  {item.recommendation_text || ""}
                </ReactMarkdown>

                {/* Tombol Hapus di kanan bawah */}
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.recommendation_id)}
                  >
                    Hapus
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </DashboardLayout>
  );
}
