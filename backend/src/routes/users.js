const express = require("express");
const {
  getUsers,
  getUserByIdController,
  createUserController,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserByIdController);
router.post("/", createUserController);

module.exports = router;
