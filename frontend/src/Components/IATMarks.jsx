import React, { useState, useEffect } from 'react';
import './IATMarks.css';

function IATMarks() {
  const [semester, setSemester] = useState('');
  const [iatNumber, setIatNumber] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch subjects when component mounts
    fetch('https://my-project-1-g9ko.onrender.com/api/subjects')
      .then(response => response.json())
      .then(data => setSubjects(data))
      .catch(error => console.error('Error fetching subjects:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = localStorage.getItem('mentorId');
    const studentName = "Student Name"; // You might want to get this from your user data

    try {
      const response = await fetch('https://my-project-1-g9ko.onrender.com/api/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          studentName,
          semester: parseInt(semester),
          iatNumber: parseInt(iatNumber),
          subject: Object.keys(marks)[0],
          marks: parseInt(Object.values(marks)[0])
        }),
      });

      if (response.ok) {
        setMessage('Marks added successfully!');
        setMarks({});
      } else {
        setMessage('Error adding marks. Please try again.');
      }
    } catch (error) {
      setMessage('Error connecting to server. Please try again.');
    }
  };

  const handleDownload = async () => {
    const studentId = localStorage.getItem('mentorId');
    try {
      const response = await fetch(`https://my-project-1-g9ko.onrender.com/api/download-report/${studentId}`);
      const data = await response.json();
      setMessage(`Report downloaded as ${data.filename}`);
    } catch (error) {
      setMessage('Error downloading report. Please try again.');
    }
  };

  return (
    <div className="iat-marks-container">
      <h2>IAT Marks Entry</h2>
      
      <form onSubmit={handleSubmit} className="marks-form">
        <div className="form-group">
          <label>Semester:</label>
          <select 
            value={semester} 
            onChange={(e) => setSemester(e.target.value)}
            required
          >
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
          </select>
        </div>

        <div className="form-group">
          <label>IAT Number:</label>
          <select 
            value={iatNumber} 
            onChange={(e) => setIatNumber(e.target.value)}
            required
          >
            <option value="">Select IAT</option>
            <option value="1">IAT 1</option>
            <option value="2">IAT 2</option>
            <option value="3">IAT 3</option>
          </select>
        </div>

        {semester && iatNumber && (
          <div className="subjects-section">
            <h3>Enter Marks</h3>
            {subjects.map((subject) => (
              <div key={subject} className="form-group">
                <label>{subject}:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={marks[subject] || ''}
                  onChange={(e) => setMarks({ ...marks, [subject]: e.target.value })}
                  required
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="submit-button">Save Marks</button>
      </form>

      <button onClick={handleDownload} className="download-button">
        Download Report
      </button>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default IATMarks; 