const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  generateBudgetRecommendation,
  getRecommendationsByUser,
  deleteRecommendation,
} = require("../controllers/aiController");

router.post("/budget", verifyToken, generateBudgetRecommendation);
router.get("/recommendations", verifyToken, getRecommendationsByUser);
router.delete("/:id", verifyToken, deleteRecommendation);

module.exports = router;
