const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryByIdController,
  //   createCategoryController,
  //   deleteCategoryController,
} = require("../controllers/categoriesController");

router.get("/", getCategories);
router.get("/:id", getCategoryByIdController);
// router.post("/", createCategoryController);
// router.delete("/:id", deleteCategoryController);

module.exports = router;
