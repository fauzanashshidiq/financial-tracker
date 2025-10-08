const {
  getTransactionByUser,
  createTransactions,
  updateTransactions,
  deleteTransactions,
} = require("../models/transactions");

// GET /transactions/:id
const getTransactionsByUserController = async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await getTransactionByUser("user_id");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// POST /transactions
const createTransactionsController = async (req, res) => {
  const { user_id, category_id, amount, date, type, description } = req.body;
  if (!user_id || !category_id || !amount || !date || !type) {
    return res.status(400).json({
      error: "user_id, category_id, amount, date, dan type wajib diisi",
    });
  }
  const { data, error } = await createTransactions({
    user_id,
    category_id,
    amount,
    date,
    type,
    description,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT transactions/:id
const updateTransactionsController = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await updateTransactions(id, req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// DELETE transactions/:id
const deleteTransactionsController = async (req, res) => {
  const { id } = req.params;
  const { error } = await deleteTransactions(id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Transaction deleted successfully" });
};

module.exports = {
  getTransactionsByUserController,
  createTransactionsController,
  updateTransactionsController,
  deleteTransactionsController,
};
