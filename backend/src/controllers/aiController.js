const { model } = require("../utils/gemini");
const supabase = require("../config/db");

exports.generateBudgetRecommendation = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { amount, period, goals } = req.body;
    console.log("REQ USER =", req.user);

    if (!amount || !period || !goals) {
      return res.status(400).json({
        message: "amount, period, dan goals wajib diisi",
      });
    }

    const prompt = `
        Buat rekomendasi budgeting yang ringkas, profesional, dan hanya berisi poin penting.

        Data pengguna:
        - Nominal bulanan: Rp ${amount}
        - Periode: ${period}
        - Goals: ${goals}

        Instruksi:
        1. Jawaban maksimal 8-12 baris.
        2. Tidak perlu membuat cerita panjang atau penjelasan umum.
        3. Fokus hanya pada hal-hal yang berhubungan langsung dengan goals.
        4. Formatkan dengan 3 bagian singkat:
        - Analisis (3 kalimat)
        - Rekomendasi pembagian budget (dalam bullet-point)
        - Tips tambahan spesifik goals (maks 3 poin)
        `;

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    const { data, error } = await supabase
      .from("recommendations")
      .insert({
        user_id: user_id,
        recommendation_text: output,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ message: "Gagal menyimpan ke database" });
    }

    return res.json({
      success: true,
      user_id,
      recommendation: output,
    });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({
      message: "Gagal memproses rekomendasi AI",
      error: error.message,
    });
  }
};

exports.getRecommendationsByUser = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ message: "Gagal mengambil data" });
    }

    return res.json({
      success: true,
      count: data.length,
      recommendations: data,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteRecommendation = async (req, res) => {
  try {
    const user_id = req.user.id;
    const recommendation_id = req.params.id;

    // cek apakah data milik user
    const { data: checkData, error: checkError } = await supabase
      .from("recommendations")
      .select("user_id")
      .eq("recommendation_id", recommendation_id)
      .single();

    if (checkError || !checkData) {
      return res.status(404).json({ message: "Rekomendasi tidak ditemukan" });
    }

    if (checkData.user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "Tidak boleh menghapus data orang lain" });
    }

    // hapus data
    const { error: deleteError } = await supabase
      .from("recommendations")
      .delete()
      .eq("recommendation_id", recommendation_id);

    if (deleteError) {
      return res.status(500).json({ message: "Gagal menghapus rekomendasi" });
    }

    return res.json({
      success: true,
      message: "Rekomendasi berhasil dihapus",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
