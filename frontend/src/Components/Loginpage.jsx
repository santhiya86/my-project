import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loginpage.css';

function Loginpage() {
  const navigate = useNavigate();
  const [mentorId, setMentorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupMentorId, setSignupMentorId] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:7048/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: mentorId,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token and mentor info
        localStorage.setItem('token', data.token);
        localStorage.setItem('mentorInfo', JSON.stringify(data.mentor));
        localStorage.setItem('mentorId', data.mentor.mentorId);
        navigate('/mentees');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleSignup = async () => {
    try {
      if (!signupMentorId || !signupPassword) {
        setError('Please fill all fields');
        return;
      }

      const response = await fetch('http://localhost:7048/api/mentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: signupMentorId,
          name: signupUsername,
          email: `mentor${signupMentorId}@college.edu`,
          department: 'Computer Science',
          password: signupPassword
        })
      });

      if (response.ok) {
        alert('Registration successful! Please login with your credentials.');
        setShowSignup(false);
        setSignupMentorId('');
        setSignupUsername('');
        setSignupPassword('');
        setError('');
      } else {
        const data = await response.json();
        if (data.error.includes('Invalid mentor ID')) {
          setError('❌ Invalid mentor ID. This mentor ID is not approved for registration.');
        } else if (data.error.includes('already exists')) {
          setError('❌ Mentor ID already registered. Please use a different ID.');
        } else {
          setError('❌ ' + (data.error || 'Registration failed'));
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Signup error:', error);
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
              placeholder="Enter your mentor ID"
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

      {/* Sign Up Section */}
      <div className="signup-section">
        <p>Don't have an account?</p>
        <button className="signup-button" onClick={() => setShowSignup(true)}>
          Sign Up
        </button>
      </div>

      {/* Sign Up Form */}
      {showSignup && (
        <div className="signup-form">
          <h3>Mentor Registration</h3>
          <div className="form-group">
            <label>Mentor ID:</label>
            <input
              type="text"
              value={signupMentorId}
              onChange={(e) => setSignupMentorId(e.target.value)}
              placeholder="Enter your Mentor ID"
              className="input-field"
            />
            <small className="helper-text">
             
            </small>
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              placeholder="Enter your username"
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-field"
            />
          </div>
          <div className="form-actions">
            <button className="signup-submit-button" onClick={handleSignup}>
              Register
            </button>
            <button className="cancel-button" onClick={() => setShowSignup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loginpage;