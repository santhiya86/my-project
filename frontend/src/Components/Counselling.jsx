import React, { useState, useEffect } from 'react';
import './Counselling.css';

function Counselling() {
  const [selectedYear, setSelectedYear] = useState(3); // Default to III year
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedIA, setSelectedIA] = useState(1);
  const [counsellingList, setCounsellingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get mentor ID from localStorage
  const mentorId = localStorage.getItem('mentorId');

  // Function to fetch students needing counselling
  const fetchCounsellingList = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://my-project-uj8a.onrender.com/api/counselling?year=${selectedYear}&semester=${selectedSemester}&ia=${selectedIA}`
      );
      const data = await response.json();
      if (response.ok) {
        setCounsellingList(data);
      } else {
        setError(data.error || 'Failed to fetch counselling list');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update counselling list when semester or IA number changes
  useEffect(() => {
    fetchCounsellingList();
  }, [selectedSemester, selectedIA, selectedYear]);

  // Function to schedule counselling
  const handleScheduleCounselling = async (student) => {
    try {
      const response = await fetch('https://my-project-uj8a.onrender.com/api/counselling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: mentorId,
          studentName: student.student_name,
          subject: student.subject,
          marks: student.marks,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          location: "Counselling Room",
          description: "Low attendance and poor marks"
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Counselling session scheduled successfully');
        fetchCounsellingList(); // Refresh the list
      } else {
        alert(data.error || 'Failed to schedule counselling');
      }
    } catch (err) {
      alert('Error connecting to server');
      console.error('Schedule error:', err);
    }
  };

  return (
    <div className="counselling-container">
      <h2>Student Counselling</h2>
      
      <div className="filters">
        <div className="filter-group">
          <label>Year:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value={1}>I Year</option>
            <option value={2}>II Year</option>
            <option value={3}>III Year</option>
            <option value={4}>IV Year</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Semester:</label>
          <select 
            value={selectedSemester} 
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
            <option value={3}>Semester 3</option>
            <option value={4}>Semester 4</option>
          </select>
        </div>

        <div className="filter-group">
          <label>IA Number:</label>
          <select 
            value={selectedIA} 
            onChange={(e) => setSelectedIA(Number(e.target.value))}
          >
            <option value={1}>IA 1</option>
            <option value={2}>IA 2</option>
            <option value={3}>IA 3</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="counselling-list">
          <h3>Students Needing Counselling</h3>
          {counsellingList.length > 0 ? (
            <table className="counselling-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {counsellingList.map((student) => (
                  <tr key={`${student.student_id}-${student.subject}`}>
                    <td>{student.student_id}</td>
                    <td>{student.student_name}</td>
                    <td>{student.subject}</td>
                    <td>{student.marks}</td>
                    <td>
                      <button
                        className="schedule-button"
                        onClick={() => handleScheduleCounselling(student)}
                      >
                        Schedule Counselling
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No students need counselling for the selected criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Counselling; 