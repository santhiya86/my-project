import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Loginpage from './Components/Loginpage'
import Homepage from './Components/Homepage'
import MenteeList from './Components/MenteeList'
import IATMarks from './Components/IATMarks'
import NewCounselling from './Components/NewCounselling'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Loginpage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/mentees" element={<MenteeList />} />
        <Route path="/iat-marks" element={<IATMarks />} />
        <Route path="/new-counselling" element={<NewCounselling />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
