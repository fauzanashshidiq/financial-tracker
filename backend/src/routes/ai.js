const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { generateBudgetRecommendation } = require("../controllers/aiController");

router.post("/budget", verifyToken, generateBudgetRecommendation);

module.exports = router;
