 import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    mentorId: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="mentorId">Mentor ID</label>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                id="mentorId" 
                name="mentorId" 
                placeholder="Enter Mentor ID"
                value={formData.mentorId}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">Sign In</button>
          <div className="login-footer">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;