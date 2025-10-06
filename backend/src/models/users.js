const supabase = require("../config/db");

// ambil semua user
const getAllUsers = async () => {
  return await supabase.from("users").select("*");
};

// ambil user berdasarkan id
const getUserById = async (id) => {
  return await supabase.from("users").select("*").eq("id", id).single();
};

// buat user baru
const createUser = async ({ name, email, password }) => {
  return await supabase
    .from("users")
    .insert([{ name, email, password }])
    .select();
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
