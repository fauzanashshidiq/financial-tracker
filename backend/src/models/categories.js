const supabase = require("../config/db");

// ambil semua kategori
const getAllCategories = async () => {
  return await supabase.from("categories").select("*");
};

// ambil kategori berdasarkan id
const getCategoryById = async (id) => {
  return await supabase.from("categories").select("*").eq("id", id).single();
};

// buat kategori baru
const createCategory = async ({ name, type }) => {
  return await supabase.from("categories").insert([{ name, type }]).select();
};

// hapus kategori berdasarkan id
const deleteCategory = async (id) => {
  return await supabase.from("categories").delete().eq("id", id);
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
};
