# IAT Marks Management - MERN Stack

## Backend Setup (Node.js + MongoDB)

1. Navigate to backend-node directory:
```bash
cd backend-node
```

2. Install dependencies:
```bash
npm install
```

3. Update your MongoDB password in `.env` file:
Replace `<db_password>` with your actual MongoDB password

4. Start the server:
```bash
npm run dev
```

## Frontend Setup (React)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Start the React app:
```bash
npm run dev
```

## Project Structure

```
project1/
├── backend-node/          # Node.js + Express + MongoDB
│   ├── server.js         # Main server file
│   ├── package.json      # Dependencies
│   └── .env             # Environment variables
├── frontend/             # React frontend
│   ├── src/
│   └── package.json
└── backend/              # Old Python backend (can be deleted)
```

## API Endpoints

- `GET /api/subjects` - Get list of subjects
- `POST /api/marks` - Add student marks
- `GET /api/marks/:student_id` - Get marks for a student
- `GET /api/download-report/:student_id` - Download Excel report

## Database

The app uses MongoDB Atlas. Make sure to:
1. Update your MongoDB connection string in `.env`
2. Ensure your IP is whitelisted in MongoDB Atlas
3. The database and collection will be created automatically
