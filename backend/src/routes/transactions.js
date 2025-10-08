const express = require("express");
const router = express.Router();
const {
  getTransactionsByUserController,
  createTransactionsController,
  updateTransactionsController,
  deleteTransactionsController,
} = require("../controllers/transactionsController");
const verifyToken = require("../middleware/verifyToken");

// router.get("/user/:user_id", getTransactionsByUserController);
// router.post("/", createTransactionsController);
// router.put("/:id", updateTransactionsController);
// router.delete("/:id", deleteTransactionsController);

router.get("/user", verifyToken, getTransactionsByUserController);
router.post("/", verifyToken, createTransactionsController);
router.put("/:id", verifyToken, updateTransactionsController);
router.delete("/:id", verifyToken, deleteTransactionsController);

module.exports = router;
