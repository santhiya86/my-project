require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { spawn } = require("child_process");
const { jsPDF } = require("jspdf");

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Approved Mentor IDs List
const APPROVED_MENTOR_IDS = [
  '101', '102', '103', '104', '105',
  '201', '202', '203', '204', '205',
  '301', '302', '303', '304', '305',
  '401', '402', '403', '404', '405'
];

// Subject Schema
const SubjectSchema = new mongoose.Schema({
  mentorId: String,
  studentId: String,
  studentName: String,
  semester: Number,
  subjectCode: String,
  subjectName: String,
  marks: Number,
  grade: String,
  attendance: Number,
  remarks: String,
  dateAdded: { type: Date, default: Date.now }
});

const Subject = mongoose.model('Subject', SubjectSchema);

// Mentor Schema
const MentorSchema = new mongoose.Schema({
  mentorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  password: { type: String, required: true }
});

const Mentor = mongoose.model('Mentor', MentorSchema);

// Student Schema - stores student data with mentorId
const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  student_name: { type: String, required: true },
  department: { type: String, required: true },   // ✅ ADD THIS
  year: { type: Number, required: true },
  section: { type: String, required: true },
  semester: { type: Number, required: true },
  mentorId: { type: String, required: true },
  subjects: [{
    code: String,
    name: String,
    marks: Number
  }]
});

const Student = mongoose.model("Student", studentSchema);

// Counselling Schema
const counsellingSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  mentorId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Counselling = mongoose.model("Counselling", counsellingSchema);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running! Use /api endpoints to interact.");
});

// Real Mentor Login API with JWT
app.post("/api/login", async (req, res) => {
  try {
    console.log("Raw request body:", req.body);
    console.log("Request headers:", req.headers);
    
    const { mentorId, password } = req.body;
    
    console.log("Parsed login attempt:", { mentorId, password });
    
    // Find mentor in database
    const mentor = await Mentor.findOne({ mentorId });
    
    console.log("Found mentor:", mentor);
    
    if (!mentor) {
      console.log("Mentor not found");
      return res.status(401).json({ message: 'Invalid mentor ID' });
    }
    
    // In real project, use bcrypt for password comparison
    if (mentor.password !== password) {
      console.log("Password mismatch:", { 
        stored: mentor.password, 
        provided: password,
        storedType: typeof mentor.password,
        providedType: typeof password,
        storedLength: mentor.password.length,
        providedLength: password.length
      });
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    console.log("Login successful!");
    
    // Generate JWT token
    const token = jwt.sign(
      { mentorId: mentor.mentorId, name: mentor.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token: token,
      mentor: {
        mentorId: mentor.mentorId,
        name: mentor.name,
        email: mentor.email,
        department: mentor.department
      }
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get mentor profile (protected route)
app.get("/api/mentor/profile", authenticateToken, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ mentorId: req.user.mentorId });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.json({
      mentorId: mentor.mentorId,
      name: mentor.name,
      email: mentor.email,
      department: mentor.department
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get students by mentorId (protected route) ID
app.get("/api/students", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user; // ← Get mentorId from token
    console.log("Fetching students for mentor:", mentorId);
    
    const students = await Student.find({ mentorId }); // ← Find students where mentorId matches
    console.log("Found students:", students);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new student
app.post("/api/students", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user;
    const studentData = req.body;
    console.log("Adding student with data:", studentData);
    console.log("Mentor ID from token:", mentorId);
    
    const student = new Student({
      ...studentData,
      mentorId
    });
    
    console.log("Student object before save:", {
      student_name: student.student_name,
      student_id: student.student_id,
      department: student.department,
      year: student.year,
      section: student.section,
      semester: student.semester,
      mentorId: student.mentorId
    });
    
    await student.save();
    console.log("Student saved successfully:", student);
    res.status(201).json(student);
  } catch (error) {
    console.log("Error adding student:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete student by ID
app.delete("/api/students/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.user;
    
    console.log("Deleting student:", { id, mentorId });
    
    // Validate ID format
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ error: "Invalid student ID" });
    }
    
    // Import ObjectId for proper MongoDB query
    const ObjectId = require('mongoose').Types.ObjectId;
    
    // Find and delete student
    const result = await Student.findOneAndDelete({ _id: new ObjectId(id), mentorId });
    
    if (!result) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    console.log("Student deleted successfully:", result);
    
    // Ensure proper JSON response
    res.status(200).json({ 
      message: "Student deleted successfully", 
      student: result 
    });
  } catch (error) {
    console.log("Error deleting student:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update student by ID
app.put("/api/students/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.user; // Get mentorId from JWT token
    
    console.log("Updating student:", { id, mentorId, body: req.body });
    
    // Find student and ensure it belongs to the logged-in mentor
    const student = await Student.findOne({ _id: id, mentorId: mentorId });
    
    console.log("Found student:", student);
    
    if (!student) {
      console.log("Student not found or access denied");
      return res.status(404).json({ message: 'Student not found or access denied' });
    }
    
    // Update student data
    const updatedStudent = await Student.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    console.log("Updated student:", updatedStudent);
    res.json(updatedStudent);
  } catch (error) {
    console.log("Update error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Mentor authentication
app.get("/api/mentors", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new mentor
app.post("/api/mentors", async (req, res) => {
  try {
    console.log("Registering new mentor:", req.body);
    console.log("Request headers:", req.headers);
    
    const { mentorId } = req.body;
    
    // Check if mentorId is in approved list
    if (!APPROVED_MENTOR_IDS.includes(mentorId)) {
      console.log("Invalid mentor ID attempted:", mentorId);
      return res.status(400).json({ 
        error: "Invalid mentor ID. This mentor ID is not approved for registration." 
      });
    }
    
    // Check if mentorId already exists
    const existingMentor = await Mentor.findOne({ mentorId });
    console.log("Existing mentor check:", existingMentor);
    
    if (existingMentor) {
      console.log("Mentor ID already exists:", mentorId);
      return res.status(400).json({ error: "Mentor ID already exists" });
    }
    
    const mentor = new Mentor(req.body);
    await mentor.save();
    console.log("New mentor registered:", mentor);
    res.status(201).json(mentor);
  } catch (error) {
    console.log("Error registering mentor:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get counselling records by mentorId
app.get("/api/counselling", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user; // Get mentorId from JWT token
    console.log("Fetching counselling for mentor:", mentorId);
    
    const counselling = await Counselling.find({ mentorId });
    console.log("Found counselling records:", counselling);
    res.json(counselling);
  } catch (error) {
    console.log("Error fetching counselling:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add new counselling record
app.post("/api/counselling", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user;
    const { student_name, date, time, location, description } = req.body;
    
    console.log("Adding counselling record:", { mentorId, student_name, date, time, location, description });
    
    // Find student details
    const student = await Student.findOne({ mentorId, student_name });
    console.log("Student lookup result:", student);
    console.log("Searching for student with:", { mentorId, student_name });
    
    if (!student) {
      console.log("Student not found in database");
      return res.status(400).json({ error: "Student not found" });
    }
    
    console.log("Found student:", {
      student_name: student.student_name,
      student_id: student.student_id,
      department: student.department,
      year: student.year,
      section: student.section
    });
    
    const counselling = new Counselling({
      mentorId,
      student_name,
      date,
      time,
      location,
      description
    });
    
    await counselling.save();
    
    // Include student details in response
    const response = {
      ...counselling.toObject(),
      student_id: student.student_id || 'N/A',
      department: student.department || 'N/A',
      year: student.year || 'N/A',
      section: student.section || 'N/A'
    };
    
    console.log("Counselling saved with student details:", response);
    res.status(201).json(response);
  } catch (error) {
    console.log("Error adding counselling:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get subjects by mentor and semester
app.get("/api/subjects", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user;
    const { semester, studentId } = req.query;
    
    console.log("Fetching subjects:", { mentorId, semester, studentId });
    
    let query = { mentorId };
    if (semester) query.semester = parseInt(semester);
    if (studentId) query.studentId = studentId;
    
    const subjects = await Subject.find(query).sort({ dateAdded: -1 });
    console.log("Found subjects:", subjects.length);
    res.json(subjects);
  } catch (error) {
    console.log("Error fetching subjects:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add new subject
app.post("/api/subjects", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user;
    const subjectData = req.body;
    
    console.log("Adding subject:", { mentorId, ...subjectData });
    
    const subject = new Subject({
      ...subjectData,
      mentorId
    });
    
    await subject.save();
    console.log("Subject saved successfully:", subject);
    res.status(201).json(subject);
  } catch (error) {
    console.log("Error adding subject:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete subject
app.delete("/api/subjects/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.user;
    
    console.log("Deleting subject:", { id, mentorId });
    
    const ObjectId = require('mongoose').Types.ObjectId;
    const result = await Subject.findOneAndDelete({ _id: new ObjectId(id), mentorId });
    
    if (!result) {
      return res.status(404).json({ error: "Subject not found" });
    }
    
    console.log("Subject deleted successfully:", result);
    res.json({ message: "Subject deleted successfully", subject: result });
  } catch (error) {
    console.log("Error deleting subject:", error);
    res.status(500).json({ error: error.message });
  }
});

// Generate subject report
app.get("/api/subject-report", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user;
    const { semester, studentId } = req.query;
    
    console.log("Generating subject report:", { mentorId, semester, studentId });
    
    let query = { mentorId };
    if (semester) query.semester = parseInt(semester);
    if (studentId) query.studentId = studentId;
    
    const subjects = await Subject.find(query).sort({ dateAdded: -1 });
    const students = await Student.find({ mentorId });
    
    console.log("Found subjects for report:", subjects.length);
    
    // Create PDF
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Title
    doc.setFontSize(20);
    doc.text('Subject Report', 105, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Filter info
    doc.setFontSize(12);
    doc.text(`Semester: ${semester || 'All'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Student: ${studentId ? students.find(s => s._id === studentId)?.student_name || 'Unknown' : 'All Students'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 20;
    
    // Subjects table
    doc.setFontSize(10);
    subjects.forEach((subject, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${index + 1}. ${subject.subjectCode} - ${subject.subjectName}`, 20, yPosition);
      yPosition += 8;
      doc.text(`   Student: ${subject.studentName} | Marks: ${subject.marks || 'N/A'} | Grade: ${subject.grade || 'N/A'} | Attendance: ${subject.attendance || 'N/A'}%`, 20, yPosition);
      yPosition += 8;
      if (subject.remarks) {
        doc.text(`   Remarks: ${subject.remarks}`, 20, yPosition);
        yPosition += 8;
      }
      yPosition += 5;
    });
    
    // Generate PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="subject-report-${semester || 'all'}-${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.log("Error generating subject report:", error);
    res.status(500).json({ error: error.message });
  }
});

// Subject Marks Schema
const SubjectMarksSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  mentorId: String,
  semester: Number,
  subjectCode: String,
  subjectName: String,
  ut1: { type: Number, default: 0 },
  a1: { type: Number, default: 0 },
  ia1: { type: Number, default: 0 },
  ut2: { type: Number, default: 0 },
  a2: { type: Number, default: 0 },
  ia2: { type: Number, default: 0 },
  ut3: { type: Number, default: 0 },
  a3: { type: Number, default: 0 },
  ia3: { type: Number, default: 0 },
  mp1: { type: Number, default: 0 },
  dateAdded: { type: Date, default: Date.now }
});

const SubjectMarks = mongoose.model('SubjectMarks', SubjectMarksSchema);

// Save subject marks
app.post("/api/subject-marks", authenticateToken, async (req, res) => {
  try {
    const { marks } = req.body;
    const { mentorId } = req.user;
    
    console.log("Saving subject marks:", { mentorId, marksCount: marks.length });
    
    // Save each mark
    const savedMarks = [];
    for (const markData of marks) {
      // Ensure mentorId matches
      if (markData.mentorId !== mentorId) {
        markData.mentorId = mentorId;
      }
      
      const mark = new SubjectMarks(markData);
      await mark.save();
      savedMarks.push(mark);
    }
    
    console.log("Subject marks saved successfully:", savedMarks.length);
    res.status(201).json({ 
      message: "Subject marks saved successfully", 
      count: savedMarks.length,
      marks: savedMarks 
    });
  } catch (error) {
    console.log("Error saving subject marks:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get subject marks
app.get("/api/subject-marks", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user;
    const { studentId, semester } = req.query;
    
    console.log("Fetching subject marks:", { mentorId, studentId, semester });
    
    let query = { mentorId };
    if (studentId) query.studentId = studentId;
    if (semester) query.semester = parseInt(semester);
    
    const marks = await SubjectMarks.find(query).sort({ dateAdded: -1 });
    console.log("Found subject marks:", marks.length);
    res.json(marks);
  } catch (error) {
    console.log("Error fetching subject marks:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/counselling-report", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user;
    const { 
      student_name, 
      date, 
      time, 
      location, 
      description,
      student_id,
      department,
      year,
      section
    } = req.body;
    
    console.log("Generating counselling report for mentor:", mentorId);
    console.log("Current counselling data:", { 
      student_name, 
      date, 
      time, 
      location, 
      description,
      student_id,
      department,
      year,
      section
    });
    
    // Get complete mentor info
    const mentor = await Mentor.findOne({ mentorId });
    console.log("Mentor details:", mentor);
    
    // Create PDF with current data
    const doc = new jsPDF();
    
    // Add simple header
    doc.setFontSize(18);
    doc.text('VELAMMAL COLLEGE OF ENGINEERING AND TECHNOLOGY', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Student Counselling Report', 105, 30, { align: 'center' });
    
    let yPosition = 50;
    
    // Student Information Section
    doc.setFontSize(14);
    doc.text('Student Information', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(`Student Name: ${student_name || 'N/A'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Student ID: ${student_id || 'N/A'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Department: ${department || 'N/A'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Year: ${year || 'N/A'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Section: ${section || 'N/A'}`, 25, yPosition);
    yPosition += 8;
    
    // Counselling Details Section
    yPosition += 10;
    doc.setFontSize(14);
    doc.text('Counselling Details', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(`Date: ${date || 'N/A'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Time: ${time || 'N/A'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Location: ${location || 'N/A'}`, 25, yPosition);
    yPosition += 8;
    
    // Description
    if (description) {
      doc.text('Description:', 25, yPosition);
      yPosition += 8;
      doc.text(description, 25, yPosition);
      yPosition += 8;
    }
    
    // Mentor Information Section
    yPosition += 10;
    doc.setFontSize(14);
    doc.text('Mentor Information', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(`Mentor ID: ${mentorId}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Name: ${mentor ? mentor.name : 'Unknown'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Email: ${mentor ? mentor.email : 'N/A'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Report Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 25, yPosition);
    yPosition += 8;
    doc.text('Generated by Mentor Management System', 25, yPosition);
    
    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="student-counselling-report-${mentorId}-${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    console.log("Error generating PDF report:", error);
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF Report for Counselling Records
app.get("/api/counselling-report", authenticateToken, async (req, res) => {
  try {
    const { mentorId } = req.user;
    console.log("Generating counselling report for mentor:", mentorId);
    
    // Get all counselling records for this mentor
    const counsellingRecords = await Counselling.find({ mentorId }).sort({ date: 1 });
    console.log("Found counselling records:", counsellingRecords.length);
    console.log("Counselling records data:", JSON.stringify(counsellingRecords, null, 2));
    
    // Get only the latest counselling record
    const latestCounselling = counsellingRecords[counsellingRecords.length - 1];
    console.log("Latest counselling record:", JSON.stringify(latestCounselling, null, 2));
    
    // Get all mentees for this mentor
    const mentees = await Student.find({ mentorId }).sort({ student_name: 1 });
    console.log("Found mentees:", mentees.length);
    
    // Get complete mentor info
    const mentor = await Mentor.findOne({ mentorId });
    console.log("Mentor details:", mentor);
    
    // Create PDF with complete format
    const doc = new jsPDF();
    
    // Add simple header
    doc.setFontSize(18);
    doc.text('VELAMMAL COLLEGE OF ENGINEERING AND TECHNOLOGY', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Student Counselling Report', 105, 30, { align: 'center' });
    
    let yPosition = 50;
    
    // Check if there are counselling records
    if (!latestCounselling) {
      doc.setFontSize(12);
      doc.text('No counselling records found.', 20, yPosition);
    } else {
      // Find student details for the latest counselling
      const student = mentees.find(m => m.student_name === latestCounselling.student_name);
      console.log("Student found for counselling:", student ? "YES" : "NO");
      console.log("Student details:", JSON.stringify(student, null, 2));
      console.log("Looking for student with name:", latestCounselling.student_name);
      console.log("Available mentees:", mentees.map(m => ({ name: m.student_name, id: m.student_id, year: m.year, section: m.section })));
      
      // Student Information Section
      doc.setFontSize(14);
      doc.text('Student Information', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(11);
      doc.text(`Student Name: ${latestCounselling.student_name}`, 25, yPosition);
      yPosition += 8;
      if (student) {
        doc.text(`Student ID: ${student.student_id || 'N/A'}`, 25, yPosition);
        yPosition += 8;
        doc.text(`Department: ${student.department || 'N/A'}`, 25, yPosition);
        yPosition += 8;
        doc.text(`Year: ${student.year || 'N/A'}`, 25, yPosition);
        yPosition += 8;
        doc.text(`Section: ${student.section || 'N/A'}`, 25, yPosition);
        yPosition += 8;
      }
      
      // Counselling Details Section
      yPosition += 10;
      doc.setFontSize(14);
      doc.text('Counselling Details', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(11);
      doc.text(`Date: ${latestCounselling.date || 'N/A'}`, 25, yPosition);
      yPosition += 8;
      doc.text(`Time: ${latestCounselling.time || 'N/A'}`, 25, yPosition);
      yPosition += 8;
      doc.text(`Location: ${latestCounselling.location || 'N/A'}`, 25, yPosition);
      yPosition += 8;
      
      // Description
      if (latestCounselling.description) {
        doc.text('Description:', 25, yPosition);
        yPosition += 8;
        doc.text(latestCounselling.description, 25, yPosition);
        yPosition += 8;
      }
      
      // Mentor Information Section
      yPosition += 10;
      doc.setFontSize(14);
      doc.text('Mentor Information', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(11);
      doc.text(`Mentor ID: ${mentorId}`, 25, yPosition);
      yPosition += 8;
      doc.text(`Name: ${mentor ? mentor.name : 'Unknown'}`, 25, yPosition);
      yPosition += 8;
      doc.text(`Email: ${mentor ? mentor.email : 'N/A'}`, 25, yPosition);
      yPosition += 8;
      doc.text(`Report Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 25, yPosition);
      yPosition += 8;
      doc.text('Generated by Mentor Management System', 25, yPosition);
    }
    
    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="student-counselling-report-${mentorId}-${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    console.log("Error generating PDF report:", error);
    res.status(500).json({ error: error.message });
  }
});

// Use Render's PORT
const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
