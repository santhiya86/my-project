require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ← Add this

const app = express();

app.use(express.json());
app.use(cors()); // ← Add this

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Student Schema - stores whatever mentor selects
const studentSchema = new mongoose.Schema({
  mentorId: String,
  mentorPassword: String,
  selectedStudentName: String
});

// Counselling Schema - stores whatever user enters
const counsellingSchema = new mongoose.Schema({
  Name: String,
  year: String,
  section: String,
  IATNumber: Number,
  date: String,
  time: String,
  location: String,
  description: String
});

// Marks Schema - stores whatever user enters
const marksSchema = new mongoose.Schema({
  mentorId: String,
  studentName: String,
  subject: String,
  semester: Number,
  marks: Number,
  dateAdded: { type: Date, default: Date.now }
});

const Student = mongoose.model("Student", studentSchema);
const Counselling = mongoose.model("Counselling", counsellingSchema);
const Marks = mongoose.model("Marks", marksSchema);

// API: Mentor selects student
app.post("/api/student", async (req, res) => {
  try {
    const { mentorId, mentorPassword, selectedStudentName } = req.body;
    const student = new Student({ mentorId, mentorPassword, selectedStudentName });
    await student.save();
    console.log("✅ Stored:", req.body);
    res.json({ message: "Student selection stored", data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Store counselling data
app.post("/api/counselling", async (req, res) => {
  try {
    const counselling = new Counselling(req.body);
    await counselling.save();
    console.log("✅ Stored counselling:", req.body);
    res.json({ message: "Counselling data stored", data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Store marks data
app.post("/api/marks", async (req, res) => {
  try {
    const marks = new Marks(req.body);
    await marks.save();
    console.log("✅ Stored marks:", req.body);
    res.json({ message: "Marks data stored", data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get all counselling
app.get("/api/counselling", async (req, res) => {
  try {
    const counselling = await Counselling.find();
    res.json(counselling);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get all marks
app.get("/api/marks", async (req, res) => {
  try {
    const marks = await Marks.find();
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use Render's PORT
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});