import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loginpage.css';

function Loginpage() {
  const navigate = useNavigate();
  const [mentorId, setMentorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Check if fields are empty
    if (!mentorId.trim() || !password.trim()) {
      setError('Please fill all fields');
      return;
    }

    // Validate mentor ID and password
    if (mentorId === '101' && password === 'mentor1') {
      localStorage.setItem('mentorId', '101');
      navigate('/home');
    } else if (mentorId === '102' && password === 'mentor2') {
      localStorage.setItem('mentorId', '102');
      navigate('/home');
    } else if (mentorId === '103' && password === 'mentor3') {
      localStorage.setItem('mentorId', '103');
      navigate('/home');
    } else {
      // Check if ID is valid
      if (!['101', '102', '103'].includes(mentorId)) {
        setError('Please enter correct ID');
      } else {
        setError('Please enter correct password');
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">MENTORING SYSTEM - MENTOR LOGIN</h1>
      <h2 className="subtitle">Academic Year 2025-2026</h2>

      <div className="login-card">
        <form onSubmit={handleLogin}>
          <div className="form-heading">Mentor Login</div>

          <div className="form-group">
            <label>Mentor ID</label>
            <input
              type="text"
              placeholder="Enter your ID"
              className="input-field"
              value={mentorId}
              onChange={(e) => setMentorId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>
      </div>

      <p className="footer-note">For authorized mentors only.</p>
    </div>
  );
}

export default Loginpage;