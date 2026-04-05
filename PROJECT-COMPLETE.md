# IAT Marks Management System - MERN Stack

## 🚀 **Project Status: COMPLETE ✅**

### 📁 **Project Structure:**
```
project1/
├── backend/                 # Node.js + Express + MongoDB
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env               # Environment variables
│   └── node_modules/      # Installed packages
├── frontend/              # React frontend
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Loginpage.jsx
│   │   │   ├── IATMarks.jsx
│   │   │   └── Counselling.jsx
│   │   └── ...
│   └── package.json
└── README-MERN.md         # This file
```

## 🎯 **How to Run:**

### **1. Backend (Terminal 1):**
```bash
cd backend
node server.js
```
**✅ Server runs on:** `http://localhost:3000`

### **2. Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
**✅ Frontend runs on:** `http://localhost:5173`

## 🔑 **Login Credentials:**
- **Mentor ID:** `101` | **Password:** `sun`
- **Mentor ID:** `102` | **Password:** `moon`
- **Mentor ID:** `103` | **Password:** `star`

## 📊 **Features:**
- ✅ **MongoDB Integration** - Connected to Atlas cluster
- ✅ **IAT Marks Management** - Add/view student marks
- ✅ **Excel Report Generation** - Download student reports
- ✅ **Student Counselling** - Track students needing counselling
- ✅ **Responsive UI** - Modern React interface

## 🔗 **API Endpoints:**
- `GET /api/subjects` - Get subjects list
- `POST /api/marks` - Add student marks
- `GET /api/marks/:student_id` - Get student marks
- `GET /api/download-report/:student_id` - Download Excel report
- `GET /api/counselling/needed` - Get students needing counselling
- `POST /api/counselling/schedule` - Schedule counselling session

## 🎉 **Project Complete!**
Your MERN stack application is fully functional with MongoDB database integration!
