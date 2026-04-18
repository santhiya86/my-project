import React, { useState } from 'react';
import './MenteeList.css';

function MenteeList() {
  const [showMarksTable, setShowMarksTable] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedIAT, setSelectedIAT] = useState(null);
  const [showLowMarksStudents, setShowLowMarksStudents] = useState(false);
  const [lowMarksStudents, setLowMarksStudents] = useState([]);
  const [marks, setMarks] = useState({});

  // Semester 1 subjects
  const semester1Subjects = [
    { code: "21CH101", name: "Engineering Chemistry" },
    { code: "21CS101", name: "Problem Solving and Python Programming" },
    { code: "21CS102", name: "Problem Solving and Python Programming Laboratory" },
    { code: "21EN101", name: "Professional English I" },
    { code: "21MA101", name: "Matrices and Calculus" },
    { code: "21PC101", name: "Physics and Chemistry Laboratory" },
    { code: "21PH101", name: "Engineering Physics" },
    { code: "21TA101", name: "Heritage of Tamil" }
  ];

  // Semester 2 subjects
  const semester2Subjects = [
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
  ];

  // Semester 3 subjects
  const semester3Subjects = [
    { code: "21CS201", name: "Computer Organization and Architecture" },
    { code: "21CS202", name: "Data Structures" },
    { code: "21CS203", name: "Object Oriented Programming" },
    { code: "21CS204", name: "Data Structures Laboratory" },
    { code: "21CS205", name: "Object Oriented Programming Laboratory" },
    { code: "21EC201", name: "Digital Principles and System Design" },
    { code: "21EC212", name: "Digital Systems Laboratory" },
    { code: "21MA203", name: "Discrete Mathematics" }
  ];

  // Semester 4 subjects
  const semester4Subjects = [
    { code: "21CS206", name: "Database Management Systems" },
    { code: "21CS207", name: "Design and Analysis of Algorithms" },
    { code: "21CS208", name: "Operating Systems" },
    { code: "21CS209", name: "Internet Programming" },
    { code: "21CS211", name: "Operating Systems Laboratory" },
    { code: "21CS212", name: "Internet Programming Laboratory" },
    { code: "21MA205", name: "Stochastic Process and its Applications" }
  ];

  // Semester 5 subjects
  const semester5Subjects = [
    { code: "21CS301", name: "Theory of Computation" },
    { code: "21CS302", name: "Computer Networks" },
    { code: "21CS302P", name: "Computer Networks Practical" },
    { code: "21CS303", name: "Artificial Intelligence and Machine Learning" },
    { code: "21CS303P", name: "AI and ML Practical" },
    { code: "21CS304", name: "Object Oriented Software Engineering" },
    { code: "21CS304P", name: "Software Engineering Practical" },
    { code: "21PCS02T", name: "Exploratory Data Analysis" },
    { code: "21PCS12T", name: "Android App Development" }
  ];

  // Semester 6 subjects
  const semester6Subjects = [
    { code: "21CS305", name: "Compiler Design" },
    { code: "21CS306T", name: "Data Science Theory" },
    { code: "21C5306", name: "Data Science Laboratory" },
    { code: "21PEC28", name: "IoT for Smart Systems" },
    { code: "21PEC57", name: "Mobile Communication" },
    { code: "21PIT02P-E1", name: "Network Security Practical" },
    { code: "21PIT02T-E1", name: "Network Security Theory" },
    { code: "21PIT18", name: "Cyber Security Essentials" },
    { code: "21EN301", name: "Professional Communication Laboratory" }
  ];

  // Semester 7 subjects
  const semester7Subjects = [
    { code: "21CS401", name: "Distributed Systems" },
    { code: "21CS402", name: "Open Elective-3" },
    { code: "21CS403", name: "Open Elective-4" },
    { code: "21CS404", name: "Project work-1" },
    { code: "21CS405", name: "Open Elective-3" },
    { code: "21CS406", name: "Open Elective-5" }
  ];

  // Semester 8 subjects
  const semester8Subjects = [
    { code: "21CS607", name: "Professional Elective-V" },
    { code: "21CS608", name: "Professional Elective-VI" },
    { code: "21CS609", name: "Project work-II" }
  ];

  // Sample mentee data
  const menteeLists = {
    '101': [
      { id: 1, name: 'Alice Johnson', department: 'CSE', year: 'III' },
      { id: 2, name: 'Bob Smith', department: 'CSE', year: 'III' },
      { id: 3, name: 'Charlie Brown', department: 'CSE', year: 'II' },
      { id: 4, name: 'Diana Prince', department: 'CSE', year: 'II' },
      { id: 5, name: 'Eve Wilson', department: 'CSE', year: 'I' },
      { id: 6, name: 'Frank Miller', department: 'CSE', year: 'I' }
    ],
    '102': [
      { id: 7, name: 'Grace Lee', department: 'ECE', year: 'III' },
      { id: 8, name: 'Henry Ford', department: 'ECE', year: 'III' },
      { id: 9, name: 'Iris Watson', department: 'ECE', year: 'II' },
      { id: 10, name: 'Jack Ryan', department: 'ECE', year: 'II' }
    ]
  };

  const handleClick = (mentee) => {
    setSelectedMentee(mentee);
    setShowMarksTable(true);
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    setMarks({}); // Clear previous marks
  };

  const handleMarkChange = (subjectCode, type, value) => {
    setMarks(prev => ({
      ...prev,
      [subjectCode]: {
        ...prev[subjectCode],
        [type]: value
      }
    }));
  };

  const renderMarksInput = (subject, type) => {
    const isLab = subject.name.toLowerCase().includes('lab');
    return (
      <input
        type="number"
        min="0"
        max="100"
        value={marks[subject.code]?.[type] || ''}
        onChange={(e) => handleMarkChange(subject.code, type, e.target.value)}
        disabled={isLab && type !== 'mp1'}
        style={{ width: '40px', textAlign: 'center' }}
      />
    );
  };

  const renderMarksTable = () => {
    let subjects;
    switch(selectedSemester) {
      case 1:
        subjects = semester1Subjects;
        break;
      case 2:
        subjects = semester2Subjects;
        break;
      case 3:
        subjects = semester3Subjects;
        break;
      case 4:
        subjects = semester4Subjects;
        break;
      case 5:
        subjects = semester5Subjects;
        break;
      case 6:
        subjects = semester6Subjects;
        break;
      case 7:
        subjects = semester7Subjects;
        break;
      case 8:
        subjects = semester8Subjects;
        break;
      default:
        subjects = [];
    }

    return (
      <div className="marks-table-container">
        <table className="marks-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>UT1</th>
              <th>A1</th>
              <th>IA1</th>
              <th>UT2</th>
              <th>A2</th>
              <th>IA2</th>
              <th>UT3</th>
              <th>A3</th>
              <th>IA3</th>
              <th>MP1</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(subject => {
              const isLab = subject.name.toLowerCase().includes('lab');
              if (isLab) {
                return (
                  <tr key={subject.code}>
                    <td>{subject.code}</td>
                    <td>{subject.name}</td>
                    <td colSpan="9">-</td>
                    <td>{renderMarksInput(subject, 'mp1')}</td>
                  </tr>
                );
              } else {
                return (
                  <tr key={subject.code}>
                    <td>{subject.code}</td>
                    <td>{subject.name || 'N/A'}</td>
                    <td>{renderMarksInput(subject, 'ut1')}</td>
                    <td>{renderMarksInput(subject, 'a1')}</td>
                    <td>{renderMarksInput(subject, 'ia1')}</td>
                    <td>{renderMarksInput(subject, 'ut2')}</td>
                    <td>{renderMarksInput(subject, 'a2')}</td>
                    <td>{renderMarksInput(subject, 'ia2')}</td>
                    <td>{renderMarksInput(subject, 'ut3')}</td>
                    <td>{renderMarksInput(subject, 'a3')}</td>
                    <td>{renderMarksInput(subject, 'ia3')}</td>
                    <td>{renderMarksInput(subject, 'mp1')}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const closeModal = () => {
    setShowMarksTable(false);
    setSelectedMentee(null);
    setSelectedSemester(null);
    setMarks({});
  };

  const handleSaveAndDownload = () => {
    // Save marks to localStorage
    const marksData = JSON.parse(localStorage.getItem('marksData')) || {};
    marksData[selectedSemester] = {
      ...marksData[selectedSemester],
      [`iat${selectedIAT}`]: Object.entries(marks).map(([subjectCode, subjectMarks]) => ({
        studentId: selectedMentee.id,
        subjectCode,
        marks: subjectMarks.ia1 || 0 // Using IA1 marks for IAT1
      }))
    };
    localStorage.setItem('marksData', JSON.stringify(marksData));

    // Create report in HTML format
    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Performance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .college-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: #1e3a8a; 
              margin-bottom: 10px; 
            }
            .report-title { 
              font-size: 20px; 
              color: #4b5563; 
              margin-bottom: 20px; 
            }
            .student-info { margin-bottom: 20px; }
            .marks-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .marks-table th, .marks-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .marks-table th { background-color: #f2f2f2; }
            .button-container {
              display: flex;
              gap: 10px;
              margin: 20px 0;
              justify-content: center;
            }
            .close-button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #1e3a8a;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              cursor: pointer;
            }
            .close-button:hover {
              background-color: #152a5f;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="college-name">Velammal College of Engineering and Technology</div>
            <div class="report-title">Student Performance Report</div>
          </div>
          <div class="student-info">
            <h2>${selectedMentee.name}</h2>
            <p>Department: ${selectedMentee.department}</p>
            <p>Year: ${selectedMentee.year}</p>
            <p>Semester: ${selectedSemester}</p>
          </div>
          <table class="marks-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>UT1</th>
                <th>A1</th>
                <th>IA1</th>
                <th>UT2</th>
                <th>A2</th>
                <th>IA2</th>
                <th>UT3</th>
                <th>A3</th>
                <th>IA3</th>
                <th>MP1</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                let subjects;
                switch(selectedSemester) {
                  case 1:
                    subjects = semester1Subjects;
                    break;
                  case 2:
                    subjects = semester2Subjects;
                    break;
                  case 3:
                    subjects = semester3Subjects;
                    break;
                  case 4:
                    subjects = semester4Subjects;
                    break;
                  case 5:
                    subjects = semester5Subjects;
                    break;
                  case 6:
                    subjects = semester6Subjects;
                    break;
                  case 7:
                    subjects = semester7Subjects;
                    break;
                  case 8:
                    subjects = semester8Subjects;
                    break;
                  default:
                    subjects = [];
                }
                
                return subjects.map(subject => {
                  const subjectMarks = marks[subject.code] || {};
                  const isLab = subject.name.toLowerCase().includes('lab');
                  
                  if (isLab) {
                    return `
                      <tr>
                        <td>${subject.code}</td>
                        <td>${subject.name}</td>
                        <td colspan="9">-</td>
                        <td>${subjectMarks.mp1 || '-'}</td>
                      </tr>
                    `;
                  } else {
                    return `
                      <tr>
                        <td>${subject.code}</td>
                        <td>${subject.name}</td>
                        <td>${subjectMarks.ut1 || '-'}</td>
                        <td>${subjectMarks.a1 || '-'}</td>
                        <td>${subjectMarks.ia1 || '-'}</td>
                        <td>${subjectMarks.ut2 || '-'}</td>
                        <td>${subjectMarks.a2 || '-'}</td>
                        <td>${subjectMarks.ia2 || '-'}</td>
                        <td>${subjectMarks.ut3 || '-'}</td>
                        <td>${subjectMarks.a3 || '-'}</td>
                        <td>${subjectMarks.ia3 || '-'}</td>
                        <td>${subjectMarks.mp1 || '-'}</td>
                      </tr>
                    `;
                  }
                }).join('');
              })()}
            </tbody>
          </table>
          <div class="button-container">
            <a href="javascript:window.close()" class="close-button">Close Report</a>
          </div>
        </body>
      </html>
    `;

    // Open report in new window
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(reportContent);
      reportWindow.document.close();
    } else {
      alert('Please allow pop-ups for this website to view the report.');
    }
  };

  // Get the appropriate mentee list based on mentor ID
  const mentorId = localStorage.getItem('mentorId') || '101';
  const mentees = menteeLists[mentorId] || [];

  return (
    <div className="mentee-list-container">
      <h2>Mentee List</h2>
      <div className="table-container">
        <table className="mentee-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>S.No</th>
              <th style={{ width: '40%' }}>Name of the Student</th>
              <th style={{ width: '20%' }}>Department</th>
              <th style={{ width: '15%' }}>Year</th>
              <th style={{ width: '15%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee) => (
              <tr key={mentee.id}>
                <td>{mentee.id}</td>
                <td>{mentee.name}</td>
                <td>{mentee.department}</td>
                <td>{mentee.year}</td>
                <td>
                  <button className="view-button" onClick={() => handleClick(mentee)}>
                    Click
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMarksTable && selectedMentee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Select Semester</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="semester-buttons">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  className={`semester-button ${selectedSemester === sem ? 'selected' : ''}`}
                  onClick={() => handleSemesterSelect(sem)}
                >
                  Semester {sem}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedSemester && selectedMentee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Semester {selectedSemester}</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            {renderMarksTable()}
            <div className="modal-footer">
              <button className="save-button" onClick={handleSaveAndDownload}>
                Save & View Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenteeList;
