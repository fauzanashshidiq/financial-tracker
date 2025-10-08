const express = require("express");
const router = express.Router();
const {
  getTransactionsByUserController,
  createTransactionsController,
  updateTransactionsController,
  deleteTransactionsController,
} = require("../controllers/transactionsController");

router.get("/:id", getTransactionsByUserController);
router.post("/", createTransactionsController);
router.put("/:id", updateTransactionsController);
router.delete("/:id", deleteTransactionsController);

module.exports = router;
