require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const userRouter = require("./routes/user");
const eventRouter = require("./routes/event");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to Virtual Event Management!");
});

// API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
