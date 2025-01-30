import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";
import { Habit } from "./models/Habit.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

const PORT = process.env.PORT || 5000;

// 🟢 USER AUTHENTICATION ROUTES

// Register a new user
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// 🟢 HABIT TRACKING ROUTES

// Add a new habit
app.post("/api/habits", async (req, res) => {
  try {
    const { userId, habitName } = req.body;
    const newHabit = new Habit({ userId, habitName });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: "Error adding habit", error: error.message });
  }
});

// Get habits by user
app.get("/api/habits/:userId", async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.params.userId });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching habits", error: error.message });
  }
});

// Update habit (mark as completed)
app.put("/api/habits/:id", async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: "Error updating habit", error: error.message });
  }
});

// Delete a habit
app.delete("/api/habits/:id", async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting habit", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// POST: Register User
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      userId: newUser._id, // Send the user ID here
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

