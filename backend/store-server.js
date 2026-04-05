require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Simple Schema - stores whatever mentor enters
const dataSchema = new mongoose.Schema({
  mentorName: String,
  studentName: String,
  subject: String,
  marks: Number,
  dateAdded: { type: Date, default: Date.now }
});

const Data = mongoose.model("Data", dataSchema);

// Store whatever mentor enters
app.post("/api/store", async (req, res) => {
  try {
    const data = new Data(req.body);
    await data.save();
    console.log("✅ Stored in MongoDB:", req.body);
    res.json({ message: "Data stored successfully", data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stored data
app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(7000, () => {
  console.log("🚀 Server running on port 7000");
  console.log("📝 Ready to store whatever mentor enters!");
});
