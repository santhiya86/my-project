require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

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

const Student = mongoose.model("Student", studentSchema);

// Counselling Schema
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

const Counselling = mongoose.model("Counselling", counsellingSchema);

// Marks Schema
const marksSchema = new mongoose.Schema({
  mentorId: String,
  studentName: String,
  subject: String,
  semester: Number,
  iatNumber: Number,
  marks: Number
});

const Marks = mongoose.model("Marks", marksSchema);

// Subjects Schema
const subjectSchema = new mongoose.Schema({
  code: String,
  name: String,
  semester: Number
});

const Subject = mongoose.model("Subject", subjectSchema);

// Mentee Schema
const menteeSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  student_name: { type: String, required: true },
  year: { type: Number, required: true },
  section: { type: String, required: true },
  semester: { type: Number, required: true },
  subjects: [{
    code: String,
    name: String,
    marks: Number
  }]
});

const Mentee = mongoose.model("Mentee", menteeSchema);

// Root route for browser
app.get("/", (req, res) => {
  res.send("✅ Backend is running! Use /api endpoints to interact.");
});

// API Routes
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/student", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/counselling", async (req, res) => {
  try {
    const { year, semester, ia } = req.query;
    let query = {};
    if (year) query.year = year;
    if (semester) query.semester = parseInt(semester);
    if (ia) query.IATNumber = parseInt(ia);
    
    const counselling = await Counselling.find(query);
    res.json(counselling);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/counselling", async (req, res) => {
  try {
    const counselling = new Counselling(req.body);
    await counselling.save();
    res.status(201).json(counselling);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/marks", async (req, res) => {
  try {
    const marks = await Marks.find();
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/marks", async (req, res) => {
  try {
    const marks = new Marks(req.body);
    await marks.save();
    res.status(201).json(marks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/mentees", async (req, res) => {
  try {
    const mentees = await Mentee.find();
    res.json(mentees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/mentees", async (req, res) => {
  try {
    const mentee = new Mentee(req.body);
    await mentee.save();
    res.status(201).json(mentee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/mentors", async (req, res) => {
  try {
    const mentors = [
      { id: "101", password: "mentor1" },
      { id: "102", password: "mentor2" },
      { id: "103", password: "mentor3" }
    ];
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use Render's PORT
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
