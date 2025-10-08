const supabase = require("../config/db");

// ambil transactions berdasarkan id
const getTransactionByUser = async (userId) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  return { data, error };
};

// buat transaksi baru
const createTransactions = async (data) => {
  const { user_id, category_id, amount, date, type, description } = data;
  const { data: result, error } = await supabase
    .from("transactions")
    .insert([{ user_id, category_id, amount, date, type, description }])
    .select();

  return { data: result, error };
};

// edit transaksi
const updateTransactions = async (id, data) => {
  const { user_id, category_id, amount, date, type, description } = data;
  const { data: result, error } = await supabase
    .from("transactions")
    .update([{ user_id, category_id, amount, date, type, description }])
    .eq("id", id)
    .select();

  return { data: result, error };
};

//hapus transaksi
const deleteTransactions = async (id) => {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  return { error };
};

module.exports = {
  getTransactionByUser,
  createTransactions,
  updateTransactions,
  deleteTransactions,
};
