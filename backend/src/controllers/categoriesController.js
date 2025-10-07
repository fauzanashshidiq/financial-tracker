const {
  getAllCategories,
  getCategoryById,
  //   createCategory,
  //   deleteCategory,
} = require("../models/categories");

// GET /categories
const getCategories = async (req, res) => {
  const { data, error } = await getAllCategories();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// GET /categories/:id
const getCategoryByIdController = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await getCategoryById(id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// POST /categories
// const createCategoryController = async (req, res) => {
//   const { name, type } = req.body;

//   if (!name || !type)
//     return res.status(400).json({ error: "Name dan Type wajib diisi" });

//   const validTypes = ["income", "expense"];
//   if (!validTypes.includes(type.toLowerCase()))
//     return res
//       .status(400)
//       .json({ error: "Type harus 'income' atau 'expense'" });

//   const { data, error } = await createCategory({
//     name,
//     type: type.toLowerCase(),
//   });
//   if (error) return res.status(400).json({ error: error.message });
//   res.status(201).json({ message: "Kategori berhasil dibuat", data });
// };

// DELETE /categories/:id
// const deleteCategoryController = async (req, res) => {
//   const { id } = req.params;
//   const { error } = await deleteCategory(id);
//   if (error) return res.status(400).json({ error: error.message });
//   res.json({ message: "Kategori berhasil dihapus" });
// };

module.exports = {
  getCategories,
  getCategoryByIdController,
  //   createCategoryController,
  //   deleteCategoryController,
};
