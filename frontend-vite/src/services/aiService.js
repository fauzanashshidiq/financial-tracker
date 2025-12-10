// src/services/aiService.js
import api from "../api/axios";

/**
 * Generate rekomendasi budget AI
 * @param {number} amount - nominal budget
 * @param {string} period - periode (harian/mingguan/bulanan/tahunan)
 * @param {Array|string} goals - array atau string goals/kebutuhan
 */
export const generateBudgetRecommendation = async (amount, period, goals) => {
  const payload = { amount, period, goals };
  return await api.post("/api/ai/budget", payload);
};

/**
 * Ambil semua rekomendasi AI user
 */
export const getRecommendationsByUser = async () => {
  return await api.get("/api/ai/recommendations");
};

/**
 * Hapus rekomendasi AI berdasarkan id
 * @param {string|number} id
 */
export const deleteRecommendation = async (id) => {
  return await api.delete(`/api/ai/${id}`);
};
