const bcrypt = require("bcrypt");
const { getAllUsers, getUserById, createUser } = require("../models/users");

// GET /users
const getUsers = async (req, res) => {
  const { data, error } = await getAllUsers();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// GET /users/:id
const getUserByIdController = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await getUserById(id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// POST /users
const createUserController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: "Name, Email, dan Password wajib diisi" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    if (error) throw error;
    res.status(201).json({ message: "User created successfully", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  getUserByIdController,
  createUserController,
};
