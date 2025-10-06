const express = require("express");
const {
  getUsers,
  getUserByIdController,
  createUserController,
  loginUserController,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserByIdController);
router.post("/", createUserController);
router.post("/login", loginUserController);

module.exports = router;
