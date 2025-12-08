const { model } = require("../utils/gemini");

exports.generateBudgetRecommendation = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { amount, period, goals } = req.body;

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
        1. Jawaban maksimal 8–12 baris.
        2. Tidak perlu membuat cerita panjang atau penjelasan umum.
        3. Fokus hanya pada hal-hal yang berhubungan langsung dengan goals.
        4. Formatkan dengan 3 bagian singkat:
        - Analisis (3 kalimat)
        - Rekomendasi pembagian budget (dalam bullet-point)
        - Tips tambahan spesifik goals (maks 3 poin)
        `;

    const result = await model.generateContent(prompt);
    const output = result.response.text();

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
