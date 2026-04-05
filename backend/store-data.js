require("dotenv").config();
const mongoose = require("mongoose");

async function storeMentorAndCounsellingData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Mentor Schema
    const mentorSchema = new mongoose.Schema({
      mentorId: String,
      mentorName: String,
      email: String,
      password: String,
    });

    // Counselling Schema
    const counsellingSchema = new mongoose.Schema({
      mentorId: String,
      mentorName: String,
      selectedStudentName: String,
      subject: String,
      marks: Number,
      counsellingDate: String,
      description: String,
    });

    const Mentor = mongoose.model("TestMentor", mentorSchema);
    const Counselling = mongoose.model("TestCounselling", counsellingSchema);

    // Store Mentor Data
    console.log("\n📝 Storing Mentor Data...");
    const mentor = new Mentor({
      mentorId: "101",
      mentorName: "Ravi",
      email: "ravi@example.com",
      password: "sun"
    });
    await mentor.save();
    console.log("✅ Mentor stored:", mentor);

    // Store Counselling Data - Mentor selects student
    console.log("\n📝 Storing Counselling Data - Mentor selects student...");
    const counselling = new Counselling({
      mentorId: "101",
      mentorName: "Ravi",
      selectedStudentName: "santhiya", // Mentor selected this student
      subject: "Data Structures",
      marks: 85,
      counsellingDate: "2026-04-02",
      description: "Low attendance and poor internal marks"
    });
    await counselling.save();
    console.log("✅ Counselling stored with selected student:", counselling);

    // Store another counselling with different student
    console.log("\n📝 Storing another counselling - Mentor selects different student...");
    const counselling2 = new Counselling({
      mentorId: "101",
      mentorName: "Ravi",
      selectedStudentName: "kavitha", // Mentor selected this student
      subject: "Database Management Systems",
      marks: 78,
      counsellingDate: "2026-04-03",
      description: "Needs help with SQL queries"
    });
    await counselling2.save();
    console.log("✅ Counselling stored with selected student:", counselling2);

    // Retrieve and show all stored data
    console.log("\n📋 Retrieving stored data...");
    
    const allMentors = await Mentor.find();
    console.log("✅ All Mentors:", allMentors);
    
    const allCounselling = await Counselling.find();
    console.log("✅ All Counselling Records:", allCounselling);

    console.log("\n🎉 Data successfully stored in MongoDB!");
    console.log("📊 Total mentors stored:", allMentors.length);
    console.log("📊 Total counselling records stored:", allCounselling.length);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

storeMentorAndCounsellingData();
