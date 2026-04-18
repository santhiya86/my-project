import React, { useState, useEffect } from 'react';
import './SubjectManagement.css';

function SubjectManagement() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjectMarks, setSubjectMarks] = useState({});
  
  const [formData, setFormData] = useState({
    studentId: '',
    subjectCode: '',
    subjectName: '',
    marks: '',
    grade: '',
    attendance: '',
    remarks: ''
  });

  const mentorId = localStorage.getItem('mentorId');

  // Semester subjects data
  const semesterSubjects = {
    1: [
      { code: "21CH101", name: "Engineering Chemistry" },
      { code: "21CS101", name: "Problem Solving and Python Programming" },
      { code: "21CS102", name: "Problem Solving and Python Programming Laboratory" },
      { code: "21EN101", name: "Professional English I" },
      { code: "21MA101", name: "Matrices and Calculus" },
      { code: "21PC101", name: "Physics and Chemistry Laboratory" },
      { code: "21PH101", name: "Engineering Physics" },
      { code: "21TA101", name: "Heritage of Tamil" }
    ],
    2: [
      { code: "21CH102", name: "Engineering Chemistry Laboratory" },
      { code: "21PH102", name: "Engineering Physics Laboratory" },
      { code: "21CH103", name: "Environmental Science" },
      { code: "21CS103", name: "Programming in C" },
      { code: "21CS104", name: "Programming in C Laboratory" },
      { code: "21EE104", name: "Basic Electrical and Electronics Engineering" },
      { code: "21EN102", name: "English-II" },
      { code: "21MA103", name: "Sampling Techniques and Numerical Methods" },
      { code: "21ME101", name: "Engineering Graphics" },
      { code: "21PH103", name: "Physics for Information Science" }
    ],
    3: [
      { code: "21CS201", name: "Computer Organization and Architecture" },
      { code: "21CS202", name: "Data Structures" },
      { code: "21CS203", name: "Object Oriented Programming" },
      { code: "21CS204", name: "Data Structures Laboratory" },
      { code: "21CS205", name: "Object Oriented Programming Laboratory" },
      { code: "21EC201", name: "Digital Principles and System Design" },
      { code: "21EC212", name: "Digital Systems Laboratory" },
      { code: "21MA203", name: "Discrete Mathematics" }
    ],
    4: [
      { code: "21CS206", name: "Database Management Systems" },
      { code: "21CS207", name: "Design and Analysis of Algorithms" },
      { code: "21CS208", name: "Operating Systems" },
      { code: "21CS209", name: "Internet Programming" },
      { code: "21CS211", name: "Operating Systems Laboratory" },
      { code: "21CS212", name: "Internet Programming Laboratory" },
      { code: "21MA205", name: "Stochastic Process and its Applications" }
    ],
    5: [
      { code: "21CS301", name: "Theory of Computation" },
      { code: "21CS302", name: "Computer Networks" },
      { code: "21CS302P", name: "Computer Networks Practical" },
      { code: "21CS303", name: "Artificial Intelligence and Machine Learning" },
      { code: "21CS303P", name: "AI and ML Practical" },
      { code: "21CS304", name: "Object Oriented Software Engineering" },
      { code: "21CS304P", name: "Software Engineering Practical" },
      { code: "21PCS02T", name: "Exploratory Data Analysis" },
      { code: "21PCS12T", name: "Android App Development" }
    ],
    6: [
      { code: "21CS305", name: "Compiler Design" },
      { code: "21CS306T", name: "Data Science Theory" },
      { code: "21C5306", name: "Data Science Laboratory" },
      { code: "21PEC28", name: "IoT for Smart Systems" },
      { code: "21PEC57", name: "Mobile Communication" },
      { code: "21PIT02P-E1", name: "Network Security Practical" },
      { code: "21PIT02T-E1", name: "Network Security Theory" },
      { code: "21PIT18", name: "Cyber Security Essentials" },
      { code: "21EN301", name: "Professional Communication Laboratory" }
    ],
    7: [
      { code: "21CS401", name: "Distributed Systems" },
      { code: "21CS402", name: "Open Elective-3" },
      { code: "21CS403", name: "Open Elective-4" },
      { code: "21CS404", name: "Project work-1" },
      { code: "21CS405", name: "Open Elective-3" },
      { code: "21CS406", name: "Open Elective-5" }
    ],
    8: [
      { code: "21CS607", name: "Professional Elective-V" },
      { code: "21CS608", name: "Professional Elective-VI" },
      { code: "21CS609", name: "Project work-II" }
    ]
  };

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7029/api/students', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch subjects when semester and student are selected
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        let url = `http://localhost:7029/api/subjects?semester=${selectedSemester}`;
        if (selectedStudent) {
          url += `&studentId=${selectedStudent}`;
        }
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSubjects(data);
        } else {
          setError('Failed to fetch subjects');
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setError('Error fetching subjects');
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedSemester && selectedStudent) {
      fetchSubjects();
    }
  }, [selectedSemester, selectedStudent]);

  const handleSemesterClick = (semester) => {
    setSelectedSemester(semester);
    // Reset subject marks when semester changes
    setSubjectMarks({});
  };

  const handleMarksChange = (subjectCode, marks) => {
    setSubjectMarks(prev => ({
      ...prev,
      [subjectCode]: marks
    }));
  };

  const handleSaveAllMarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const selectedStudentId = selectedStudent || students[0]?._id;
      
      if (!selectedStudentId) {
        alert('Please select a student first');
        return;
      }

      // Save all subjects with marks
      const subjectsToSave = [];
      const currentSemesterSubjects = semesterSubjects[selectedSemester] || [];
      
      for (const subject of currentSemesterSubjects) {
        const marks = subjectMarks[subject.code];
        if (marks !== undefined && marks !== '') {
          subjectsToSave.push({
            studentId: selectedStudentId,
            subjectCode: subject.code,
            subjectName: subject.name,
            semester: selectedSemester,
            marks: parseInt(marks),
            grade: calculateGrade(parseInt(marks)),
            attendance: '', // You can add attendance field later
            remarks: ''
          });
        }
      }

      if (subjectsToSave.length === 0) {
        alert('Please enter at least one mark');
        return;
      }

      // Save all subjects
      for (const subjectData of subjectsToSave) {
        const response = await fetch('http://localhost:7029/api/subjects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...subjectData,
            studentName: students.find(s => s._id === subjectData.studentId)?.student_name || 'Unknown'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save subject');
        }
      }

      alert(`Successfully saved ${subjectsToSave.length} subjects!`);
      
      // Refresh subjects list
      const fetchResponse = await fetch(`http://localhost:7029/api/subjects?semester=${selectedSemester}&studentId=${selectedStudentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        setSubjects(data);
      }

    } catch (error) {
      console.error('Error saving subjects:', error);
      alert('Error saving subjects: ' + error.message);
    }
  };

  const calculateGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'F';
  };

  const handleAddSubject = () => {
    setShowAddForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSubject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7029/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          semester: selectedSemester,
          studentName: students.find(s => s._id === formData.studentId)?.student_name || 'Unknown'
        })
      });

      if (response.ok) {
        const newSubject = await response.json();
        setSubjects(prev => [newSubject, ...prev]);
        setShowAddForm(false);
        setFormData({
          studentId: '',
          subjectCode: '',
          subjectName: '',
          marks: '',
          grade: '',
          attendance: '',
          remarks: ''
        });
        alert('Subject added successfully!');
      } else {
        setError('Failed to add subject');
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      setError('Error adding subject');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:7029/api/subjects/${subjectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setSubjects(prev => prev.filter(s => s._id !== subjectId));
          alert('Subject deleted successfully!');
        } else {
          setError('Failed to delete subject');
        }
      } catch (error) {
        console.error('Error deleting subject:', error);
        setError('Error deleting subject');
      }
    }
  };

  const handleGenerateReport = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `http://localhost:7029/api/subject-report?semester=${selectedSemester}`;
      if (selectedStudent) {
        url += `&studentId=${selectedStudent}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `subject-report-semester-${selectedSemester}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        setError('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Error generating report');
    }
  };

  return (
    <div className="subject-management">
      <h2>Subject Management</h2>
      
      {/* Step 1: Student Selection */}
      {!selectedStudent && (
        <div className="student-selection">
          <h3>Select Student</h3>
          <div className="student-grid">
            {students.map(student => (
              <button
                key={student._id}
                className="student-card"
                onClick={() => setSelectedStudent(student._id)}
              >
                <div className="student-info">
                  <h4>{student.student_name}</h4>
                  <p>{student.student_id}</p>
                  <p>Year: {student.year} | Section: {student.section}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Semester Selection (after student is selected) */}
      {selectedStudent && !selectedSemester && (
        <div className="semester-selection">
          <h3>Select Semester for {students.find(s => s._id === selectedStudent)?.student_name}</h3>
          <div className="semester-buttons">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <button
                key={sem}
                className={`semester-btn`}
                onClick={() => handleSemesterClick(sem)}
              >
                Semester {sem}
              </button>
            ))}
          </div>
          <button 
            className="back-btn" 
            onClick={() => {
              setSelectedStudent('');
              setSelectedSemester(null);
            }}
          >
            Back to Students
          </button>
        </div>
      )}

      {/* Step 3: Course Details (after semester is selected) */}
      {selectedStudent && selectedSemester && (
        <div className="course-details">
          <h3>Semester {selectedSemester} Subjects - {students.find(s => s._id === selectedStudent)?.student_name}</h3>
          <div className="subjects-grid">
            {semesterSubjects[selectedSemester]?.map(subject => (
              <div key={subject.code} className="subject-card">
                <div className="subject-info">
                  <h4>{subject.code}</h4>
                  <p>{subject.name}</p>
                </div>
                <div className="subject-input">
                  <input
                    type="number"
                    placeholder="Enter Marks"
                    value={subjectMarks[subject.code] || ''}
                    onChange={(e) => handleMarksChange(subject.code, e.target.value)}
                    className="marks-input"
                    min="0"
                    max="100"
                  />
                  {subjectMarks[subject.code] && (
                    <span className="grade-display">
                      Grade: {calculateGrade(parseInt(subjectMarks[subject.code]))}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="action-buttons">
            <button className="save-all-btn" onClick={handleSaveAllMarks}>
              Save All Marks
            </button>
            <button className="report-btn" onClick={handleGenerateReport}>
              Generate Report
            </button>
            <button 
              className="back-btn" 
              onClick={() => {
                setSelectedSemester(null);
                setSubjectMarks({});
              }}
            >
              Back to Semesters
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading">
          Loading subjects...
        </div>
      )}

      {/* Existing Subjects List */}
      {subjects.length > 0 && selectedStudent && selectedSemester && (
        <div className="subjects-list">
          <h3>Saved Subjects for {students.find(s => s._id === selectedStudent)?.student_name} - Semester {selectedSemester}</h3>
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => (
                <tr key={subject._id}>
                  <td>{subject.subjectCode}</td>
                  <td>{subject.subjectName}</td>
                  <td>{subject.marks || 'N/A'}</td>
                  <td>{subject.grade || 'N/A'}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteSubject(subject._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SubjectManagement;
