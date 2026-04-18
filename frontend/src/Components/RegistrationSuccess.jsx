import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationSuccess.css';

function RegistrationSuccess() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Registration Successful!</h1>
        <p>Your mentor account has been created successfully.</p>
        <p>You can now login with:</p>
        <div className="login-info">
          <p><strong>Username:</strong> M101</p>
          <p><strong>Password:</strong> [Your chosen password]</p>
        </div>
        <div className="success-actions">
          <button className="login-button" onClick={handleGoToLogin}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSuccess;
