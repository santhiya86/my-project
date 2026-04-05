require("dotenv").config();
const mongoose = require("mongoose");

async function testMentorStudentStorage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Simple Schema - stores whatever mentor chooses
    const dataSchema = new mongoose.Schema({
      mentorId: String,
      mentorName: String,
      selectedStudentName: String,
      action: String, // what mentor did
      timestamp: { type: Date, default: Date.now }
    });

    const Data = mongoose.model("MentorStudentData", dataSchema);

    // Test Mentor 101 (password: sun)
    console.log("\n🧪 Testing Mentor 101 (password: sun)...");
    const mentor101 = new Data({
      mentorId: "101",
      mentorName: "Ravi",
      selectedStudentName: "santhiya", // Mentor chose this student
      action: "selected student for counselling"
    });
    await mentor101.save();
    console.log("✅ Mentor 101 selected student 'santhiya' - stored in MongoDB");

    // Test Mentor 102 (password: moon)
    console.log("\n🧪 Testing Mentor 102 (password: moon)...");
    const mentor102 = new Data({
      mentorId: "102", 
      mentorName: "Priya",
      selectedStudentName: "kavitha", // Mentor chose this student
      action: "selected student for counselling"
    });
    await mentor102.save();
    console.log("✅ Mentor 102 selected student 'kavitha' - stored in MongoDB");

    // Test Mentor 103 (password: star)
    console.log("\n🧪 Testing Mentor 103 (password: star)...");
    const mentor103 = new Data({
      mentorId: "103",
      mentorName: "Kumar", 
      selectedStudentName: "divya", // Mentor chose this student
      action: "selected student for counselling"
    });
    await mentor103.save();
    console.log("✅ Mentor 103 selected student 'divya' - stored in MongoDB");

    // Show all stored data
    console.log("\n📋 All stored data:");
    const allData = await Data.find();
    allData.forEach(data => {
      console.log(`  - Mentor ${data.mentorId} (${data.mentorName}) selected student: ${data.selectedStudentName}`);
    });

    console.log(`\n🎉 Total records stored: ${allData.length}`);
    console.log("📍 Database: myproject");
    console.log("📍 Collection: mentorstudentdatas");

    await mongoose.disconnect();
    console.log("\n✅ Test completed!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testMentorStudentStorage();
