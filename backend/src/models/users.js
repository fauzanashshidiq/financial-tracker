const supabase = require("../config/db");

// ambil semua user
const getAllUsers = async () => {
  return await supabase.from("users").select("*");
};

// ambil user berdasarkan id
const getUser = async (id) => {
  return await supabase.from("users").select("*").eq("id", id).single();
};

// buat user baru
const createUser = async ({ name, email, password }) => {
  return await supabase
    .from("users")
    .insert([{ name, email, password }])
    .select();
};

const updateUser = async (id, { name, balance }) => {
  const payload = {};
  if (name !== undefined) payload.name = name;
  if (balance !== undefined) payload.balance = balance;

  return await supabase
    .from("users")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
};
