require("dotenv").config();
const express = require("express");
const cors = require("cors");
const middlewareLogRequest = require("./middleware/log");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global
app.use(cors());
app.use(express.json());
app.use(middlewareLogRequest);

// Route utama
app.get("/", (req, res) => {
  res.send("Financial Tracker API is running...");
});

// Routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
