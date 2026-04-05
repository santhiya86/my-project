import React from 'react';
import './CounsellingReport.css';

function CounsellingReport({ reportData }) {
  return (
    <div className="report-container">
      <h2>Counselling Student Report</h2>
      <div className="report-content">
        <div className="report-section">
          <h3>Student Information</h3>
          <p><strong>Name:</strong> {reportData.menteeName}</p>
          <p><strong>Year:</strong> {reportData.year}</p>
          <p><strong>Section:</strong> {reportData.section}</p>
        </div>

        <div className="report-section">
          <h3>Counselling Details</h3>
          <p><strong>Semester:</strong> {reportData.semester}</p>
          <p><strong>IAT Number:</strong> {reportData.iatNumber}</p>
          <p><strong>Date:</strong> {reportData.date}</p>
          <p><strong>Time:</strong> {reportData.time}</p>
          <p><strong>Location:</strong> {reportData.location}</p>
        </div>

        <div className="report-section">
          <h3>Feedback</h3>
          <p>{reportData.description}</p>
        </div>
      </div>
    </div>
  );
}

export default CounsellingReport;
