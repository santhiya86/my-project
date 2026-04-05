import React, { useState } from 'react';
import './NewCounselling.css';
import CounsellingReport from './CounsellingReport';

function NewCounselling() {
  const [formData, setFormData] = useState({
    menteeName: '',
    year: '',
    section: '',
    semester: '',
    iatNumber: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const mentorId = localStorage.getItem('mentorId');

  const menteeLists = {
    '101': [
      { name: "C.Santhiya", year: "III", section: "A" },
      { name: "S.Koushika", year: "III", section: "A" },
      { name: "Kavitha", year: "III", section: "B" },
      { name: "Diruja", year: "III", section: "B" }
    ],
    '102': [
      { name: "Shivani Suresh", year: "III", section: "A" },
      { name: "Hemavathi", year: "III", section: "A" },
      { name: "Shapna", year: "III", section: "B" },
      { name: "Blessy", year: "III", section: "B" }
    ],
    '103': [
      { name: "Bhava Harini", year: "III", section: "A" },
      { name: "Balasanthosini", year: "III", section: "A" },
      { name: "Narmatha", year: "III", section: "B" },
      { name: "Jeyabharathi", year: "III", section: "B" }
    ]
  };

  const currentMentees = menteeLists[mentorId] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setReportData(formData);
    setShowReport(true);
  };

  return (
    <div className="new-counselling-container">
      <h2>{showReport ? 'Counselling Student Report' : 'New Counselling'}</h2>
      <div className="form-content">
        {showReport ? (
          <CounsellingReport reportData={reportData} />
        ) : (
          <form onSubmit={handleSubmit} className="counselling-form">
            <div className="form-group">
              <div className="selected-value">Name: {formData.menteeName}</div>
              <label htmlFor="menteeName">Mentee Name</label>
              <select 
                id="menteeName" 
                name="menteeName" 
                value={formData.menteeName}
                onChange={handleChange}
                required
              >
                <option value="">Select Mentee</option>
                {currentMentees.map(mentee => (
                  <option key={mentee.name} value={mentee.name}>
                    {mentee.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <div className="selected-value">Year: {formData.year}</div>
              <label htmlFor="year">Year</label>
              <select 
                id="year" 
                name="year" 
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
              </select>
            </div>

            <div className="form-group">
              <div className="selected-value">Section: {formData.section}</div>
              <label htmlFor="section">Section</label>
              <select 
                id="section" 
                name="section" 
                value={formData.section}
                onChange={handleChange}
                required
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            <div className="form-group">
              <div className="selected-value">Semester: {formData.semester}</div>
              <label htmlFor="semester">Semester</label>
              <select 
                id="semester" 
                name="semester" 
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">Select Semester</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className="form-group">
              <div className="selected-value">IAT Number: {formData.iatNumber}</div>
              <label htmlFor="iatNumber">IAT Number</label>
              <select 
                id="iatNumber" 
                name="iatNumber" 
                value={formData.iatNumber}
                onChange={handleChange}
                required
              >
                <option value="">Select IAT Number</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            <div className="form-group">
              <div className="selected-value">Date: {formData.date}</div>
              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date" 
                name="date" 
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="selected-value">Time: {formData.time}</div>
              <label htmlFor="time">Time</label>
              <input 
                type="time" 
                id="time" 
                name="time" 
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="selected-value">Location: {formData.location}</div>
              <label htmlFor="location">Location</label>
              <select 
                id="location" 
                name="location" 
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                <option value="seminar_hall">Seminar Hall</option>
              </select>
            </div>

            <div className="form-group">
              <div className="selected-value">Description: {formData.description}</div>
              <label htmlFor="description">Description</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter your feedback"
              />
            </div>

            <button type="submit" className="submit-button">Generate Report</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default NewCounselling;