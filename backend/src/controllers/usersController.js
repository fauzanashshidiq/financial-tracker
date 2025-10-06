const { getAllUsers, getUserById, createUser } = require("../models/users");

// GET /api/users
const getUsers = async (req, res) => {
  const { data, error } = await getAllUsers();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// GET /api/users/:id
const getUserByIdController = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await getUserById(id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// POST /api/users
const createUserController = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email)
    return res.status(400).json({ error: "Name dan Email wajib diisi" });

  const { data, error } = await createUser({ name, email });
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

module.exports = {
  getUsers,
  getUserByIdController,
  createUserController,
};
