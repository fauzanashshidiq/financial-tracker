const express = require("express");
const {
  getUsers,
  getUserByIdController,
  createUserController,
  loginUserController,
  updateUserController,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserByIdController);
router.post("/", createUserController);
router.post("/login", loginUserController);
router.patch("/:id", updateUserController);

module.exports = router;
