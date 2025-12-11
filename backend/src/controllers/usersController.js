const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../config/db");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
} = require("../models/users");

// GET /users
const getUsers = async (req, res) => {
  const { data, error } = await getAllUsers();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// GET /users/:id
const getUserByIdController = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await getUser(id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// POST /users (Register)
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

    const user = data[0];

    // Buat token langsung
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(201).json({
      message: "Register berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST /users/login
const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email dan Password wajib diisi" });

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user)
    return res.status(404).json({ error: "User tidak ditemukan" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Password salah" });

  // Buat token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  res.json({
    message: "Login berhasil",
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
};

// PATCH /users/:id (edit profile / dashboard)
const updateUserController = async (req, res) => {
  const { id } = req.params;
  const { name, balance } = req.body;

  if (name === undefined && balance === undefined)
    return res.status(400).json({ error: "Nama atau balance wajib diisi" });

  try {
    const { data, error } = await updateUser(id, { name, balance });
    if (error) throw error;
    res.json({ message: "User berhasil diperbarui", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  getUserByIdController,
  createUserController,
  loginUserController,
  updateUserController,
};
