import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connection is succesful!"))
  .catch((err) => console.log("MongoDB connection error!:", err));

// Test endpoint
app.get("/", (req, res) => {
  res.send("Combine backend is running!");
});

// Auth route
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import userRoutes from "./routes/user.js";
app.use("/user", userRoutes);

