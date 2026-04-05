require("dotenv").config();
const mongoose = require("mongoose");

async function checkMongoDBData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    console.log("📍 Database:", mongoose.connection.name);
    console.log("📍 Host:", mongoose.connection.host);

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

    // Check all collections
    console.log("\n📋 Checking all collections in database...");
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📁 Collections found:", collections.map(c => c.name));

    // Check mentors
    const mentors = await Mentor.find();
    console.log("\n👥 Mentors in database:", mentors.length);
    mentors.forEach(m => {
      console.log(`  - ${m.mentorId}: ${m.mentorName} (${m.password})`);
    });

    // Check counselling
    const counselling = await Counselling.find();
    console.log("\n📝 Counselling records in database:", counselling.length);
    counselling.forEach(c => {
      console.log(`  - Mentor ${c.mentorId} selected student: ${c.selectedStudentName}`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Check completed!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkMongoDBData();
