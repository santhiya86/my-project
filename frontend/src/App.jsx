import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Loginpage from './Components/Loginpage'
import Homepage from './Components/Homepage'
import MenteeList from './Components/MenteeList'
import SubjectManagement from './Components/SubjectManagement'
import IATMarks from './Components/IATMarks'
import NewCounselling from './Components/NewCounselling'
import RegistrationSuccess from './Components/RegistrationSuccess'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Loginpage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/mentees" element={<MenteeList />} />
        <Route path="/subjects" element={<SubjectManagement />} />
        <Route path="/iat-marks" element={<IATMarks />} />
        <Route path="/new-counselling" element={<NewCounselling />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
