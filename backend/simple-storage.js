require("dotenv").config();
const mongoose = require("mongoose");

async function simpleStorage() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Student Schema - under mentor
    const studentSchema = new mongoose.Schema({
      mentorId: String,
      mentorPassword: String,
      selectedStudentName: String
    });

    // Counselling Schema - exactly as user enters
    const counsellingSchema = new mongoose.Schema({
      mentorId: String,
      studentName: String,
      subject: String,
      marks: Number,
      date: String,
      time: String,
      location: String,
      description: String
    });

    const Student = mongoose.model("Student", studentSchema);
    const Counselling = mongoose.model("Counselling", counsellingSchema);

    // Mentor 101 (sun) selects student
    console.log("\n🧪 Mentor 101 selects student...");
    const student1 = new Student({
      mentorId: "101",
      mentorPassword: "sun",
      selectedStudentName: "santhiya" // Whatever mentor selects
    });
    await student1.save();
    console.log("✅ Stored: Mentor 101 selected student 'santhiya'");

    // Mentor 102 (moon) selects student  
    console.log("\n🧪 Mentor 102 selects student...");
    const student2 = new Student({
      mentorId: "102",
      mentorPassword: "moon", 
      selectedStudentName: "kavitha" // Whatever mentor selects
    });
    await student2.save();
    console.log("✅ Stored: Mentor 102 selected student 'kavitha'");

    // Counselling - exactly as user enters
    console.log("\n🧪 Counselling data - exactly as entered...");
    const counselling = new Counselling({
      mentorId: "101",
      studentName: "santhiya", // Selected student
      subject: "Data Structures",
      marks: 85,
      date: "2026-04-02",
      time: "10:30 AM", 
      location: "Room 1",
      description: "Low attendance"
    });
    await counselling.save();
    console.log("✅ Stored counselling data exactly as entered");

    // Show what's stored
    console.log("\n📋 Students stored under mentors:");
    const students = await Student.find();
    students.forEach(s => {
      console.log(`  - Mentor ${s.mentorId} (${s.mentorPassword}) selected: ${s.selectedStudentName}`);
    });

    console.log("\n📋 Counselling data stored:");
    const counsellingData = await Counselling.find();
    counsellingData.forEach(c => {
      console.log(`  - Mentor ${c.mentorId} - Student ${c.studentName} - ${c.subject} - ${c.marks} marks`);
    });

    await mongoose.disconnect();
    console.log("\n🎉 Simple storage completed!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

simpleStorage();
