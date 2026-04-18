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
  const [mentees, setMentees] = useState([]);
  const [counsellingRecords, setCounsellingRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCounsellingReport, setShowCounsellingReport] = useState(false);
  const [showScheduleCounselling, setShowScheduleCounselling] = useState(false);
  const [selectedCounsellingMentee, setSelectedCounsellingMentee] = useState('');
  const [lastScheduledStudent, setLastScheduledStudent] = useState(null);
  const [counsellingDate, setCounsellingDate] = useState('');
  const [counsellingTime, setCounsellingTime] = useState('');
  const [counsellingLocation, setCounsellingLocation] = useState('');
  const [counsellingDescription, setCounsellingDescription] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    student_name: '',
    department: '',
    year: '',
    section: '',
    semester: ''
  });
  const [addingStudent, setAddingStudent] = useState(false);
  const [addFormData, setAddFormData] = useState({
    student_name: '',
    student_id: '',
    department: '',
    year: '',
    section: '',
    semester: ''
  });

  // Marks table state
  const [showSubjectMarks, setShowSubjectMarks] = useState(false);
  const [selectedMarksStudent, setSelectedMarksStudent] = useState(null);
  const [selectedMarksSemester, setSelectedMarksSemester] = useState(null);
  const [subjectMarks, setSubjectMarks] = useState({});

  // Get mentor ID from localStorage
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

  // Marks table functions
  const handleMarksClick = (student) => {
    setSelectedMarksStudent(student);
    setShowSubjectMarks(true);
  };

  const handleSemesterSelect = (semester) => {
    setSelectedMarksSemester(semester);
    setSubjectMarks({});
  };

  const handleMarkChange = (subjectCode, type, value) => {
    setSubjectMarks(prev => ({
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
        value={subjectMarks[subject.code]?.[type] || ''}
        onChange={(e) => handleMarkChange(subject.code, type, e.target.value)}
        disabled={isLab && type !== 'mp1'}
        style={{ width: '40px', textAlign: 'center' }}
      />
    );
  };

  const renderMarksTable = () => {
    const subjects = semesterSubjects[selectedMarksSemester] || [];

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
                    <td>{subject.name}</td>
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

  const closeMarksModal = () => {
    setShowSubjectMarks(false);
    setSelectedMarksStudent(null);
    setSelectedMarksSemester(null);
    setSubjectMarks({});
  };

  const handleMarksSaveAndDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Save all marks to MongoDB
      const subjects = semesterSubjects[selectedMarksSemester] || [];
      const marksToSave = [];
      
      subjects.forEach(subject => {
        const subjectMark = subjectMarks[subject.code] || {};
        if (Object.keys(subjectMark).length > 0) {
          marksToSave.push({
            studentId: selectedMarksStudent._id,
            studentName: selectedMarksStudent.student_name,
            mentorId: mentorId,
            semester: selectedMarksSemester,
            subjectCode: subject.code,
            subjectName: subject.name,
            ut1: subjectMark.ut1 || 0,
            a1: subjectMark.a1 || 0,
            ia1: subjectMark.ia1 || 0,
            ut2: subjectMark.ut2 || 0,
            a2: subjectMark.a2 || 0,
            ia2: subjectMark.ia2 || 0,
            ut3: subjectMark.ut3 || 0,
            a3: subjectMark.a3 || 0,
            ia3: subjectMark.ia3 || 0,
            mp1: subjectMark.mp1 || 0,
            dateAdded: new Date().toISOString()
          });
        }
      });

      if (marksToSave.length > 0) {
        // Save to MongoDB
        const response = await fetch('http://localhost:7048/api/subject-marks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ marks: marksToSave })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Marks saved to MongoDB:', result);
          alert(`Successfully saved ${marksToSave.length} subject marks to database!`);
        } else {
          const error = await response.json();
          console.error('Failed to save marks:', error);
          alert('Failed to save marks to database: ' + (error.message || error.error));
        }
      }

      // Generate and download HTML report
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
            <h2>${selectedMarksStudent.student_name}</h2>
            <p>Department: ${selectedMarksStudent.department}</p>
            <p>Year: ${selectedMarksStudent.year}</p>
            <p>Semester: ${selectedMarksSemester}</p>
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
              ${semesterSubjects[selectedMarksSemester]?.map(subject => {
                const subjectMark = subjectMarks[subject.code] || {};
                const isLab = subject.name.toLowerCase().includes('lab');
                
                if (isLab) {
                  return `
                    <tr>
                      <td>${subject.code}</td>
                      <td>${subject.name}</td>
                      <td colspan="9">-</td>
                      <td>${subjectMark.mp1 || '-'}</td>
                    </tr>
                  `;
                } else {
                  return `
                    <tr>
                      <td>${subject.code}</td>
                      <td>${subject.name}</td>
                      <td>${subjectMark.ut1 || '-'}</td>
                      <td>${subjectMark.a1 || '-'}</td>
                      <td>${subjectMark.ia1 || '-'}</td>
                      <td>${subjectMark.ut2 || '-'}</td>
                      <td>${subjectMark.a2 || '-'}</td>
                      <td>${subjectMark.ia2 || '-'}</td>
                      <td>${subjectMark.ut3 || '-'}</td>
                      <td>${subjectMark.a3 || '-'}</td>
                      <td>${subjectMark.ia3 || '-'}</td>
                      <td>${subjectMark.mp1 || '-'}</td>
                    </tr>
                  `;
                }
              }).join('')}
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
    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Error saving marks: ' + error.message);
    }
  };

  // Fetch mentees from backend with JWT
  React.useEffect(() => {
    const fetchMentees = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        console.log("Fetching students with JWT token");
        const response = await fetch('http://localhost:7048/api/students', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("Students fetch response status:", response.status);
        console.log("Students fetch response ok:", response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Found students:", data);
          setMentees(data);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch students:", errorData);
          alert(`Failed to fetch students: ${errorData.message || errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        alert(`Failed to fetch students: ${error.message}`);
      }
    };

    const fetchCounselling = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        console.log("Fetching counselling with JWT token");
        const response = await fetch('http://localhost:7048/api/counselling', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Found counselling records:", data);
          setCounsellingRecords(data);
        } else {
          console.error('Failed to fetch counselling records');
        }
      } catch (error) {
        console.error('Error fetching counselling:', error);
      }
    };

    fetchMentees();
    fetchCounselling();
  }, []);

  // Handle mentee click
  const handleClick = (mentee) => {
    handleMarksClick(mentee);
  };

  // Handle semester button click
  const handleSemesterClick = (semester) => {
    setSelectedSemester(semester);
    setSelectedIAT(null);
    setShowLowMarksStudents(false);
    setLowMarksStudents([]);
    setMarks({});
  };

  // Handle IAT button click
  const handleIATClick = (iat) => {
    setSelectedIAT(iat);
    setShowLowMarksStudents(false);
    setLowMarksStudents([]);
    setMarks({});
  };

  // Handle view marks
  const handleViewMarks = () => {
    if (selectedMentee && selectedSemester !== null) {
      setShowMarksTable(true);
    }
  };

  // Handle view low marks students
  const handleViewLowMarksStudents = () => {
    if (selectedMentee && selectedSemester !== null) {
      setShowLowMarksStudents(true);
    }
  };

  // Handle save and download report
  const handleSaveAndDownload = () => {
    if (selectedMentee && selectedSemester !== null) {
      alert(`Counselling Report for ${selectedMentee.student_name} downloaded successfully!`);
    }
  };

  // Handle edit click
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditFormData({
      student_name: student.student_name || '',
      department: student.department || '',
      year: student.year || '',
      section: student.section || '',
      semester: student.semester || ''
    });
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle delete student
  const handleDeleteStudent = async (studentId, studentName) => {
    try {
      const token = localStorage.getItem('token');
      console.log("Deleting student:", { studentId, studentName });
      
      const response = await fetch(`http://localhost:7048/api/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Delete response status:", response.status);
      console.log("Delete response ok:", response.ok);

      if (response.ok) {
        setMentees(prev => prev.filter(student => student._id !== studentId));
        alert(`Student "${studentName}" deleted successfully!`);
      } else {
        // Try to get error details
        const responseText = await response.text();
        console.error("Failed to delete student - Response:", responseText);
        
        // Try to parse as JSON if possible
        let errorMessage = 'Unknown error';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || 'Unknown error';
        } catch (e) {
          errorMessage = responseText.includes('<!DOCTYPE') ? 'Server error occurred' : responseText;
        }
        
        alert(`Failed to delete student: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student: ' + error.message);
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Saving edit:", { 
        studentId: editingStudent._id, 
        editData: editFormData,
        token: token ? "exists" : "missing"
      });
      
      const response = await fetch(`http://localhost:7048/api/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const updatedStudent = await response.json();
        console.log("Updated student response:", updatedStudent);
        setMentees(prev => prev.map(student => 
          student._id === editingStudent._id ? updatedStudent : student
        ));
        setEditingStudent(null);
        alert('Student information updated successfully!');
      } else {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        alert('Failed to update student information: ' + (errorData.message || errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student information: ' + error.message);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditFormData({
      student_name: '',
      department: '',
      year: '',
      section: '',
      semester: ''
    });
  };

  // Handle add student click
  const handleAddStudentClick = () => {
    setAddingStudent(true);
    setAddFormData({
      student_name: '',
      student_id: '',
      department: '',
      year: '',
      section: '',
      semester: ''
    });
  };

  // Handle add form change
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save new student
  const handleSaveNewStudent = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!addFormData.student_name || !addFormData.student_id || !addFormData.department || !addFormData.year || !addFormData.section || !addFormData.semester) {
        alert('Please fill all fields');
        return;
      }

      const response = await fetch('http://localhost:7048/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...addFormData,
          mentorId: mentorId
        })
      });

      console.log("Student add response status:", response.status);
      console.log("Student add response ok:", response.ok);

      if (response.ok) {
        const newStudent = await response.json();
        console.log("New student added:", newStudent);
        setMentees(prev => [...prev, newStudent]);
        setAddingStudent(false);
        alert('Student added successfully!');
      } else {
        const errorData = await response.json();
        console.error("Failed to add student:", errorData);
        alert(`Failed to add student: ${errorData.message || errorData.error || 'Unknown error'}`);
        setAddingStudent(false);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student: ' + error.message);
      setAddingStudent(false);
    }
  };

  // Handle cancel add
  const handleCancelAdd = () => {
    setAddingStudent(false);
    setAddFormData({
      student_name: '',
      student_id: '',
      department: '',
      year: '',
      section: '',
      semester: ''
    });
  };

  // Handle schedule counselling click
  const handleScheduleCounsellingClick = () => {
    setShowScheduleCounselling(true);
  };

  // Handle show counselling report
  const handleShowCounsellingReport = () => {
    setShowCounsellingReport(true);
  };

  // Handle close report
  const handleCloseReport = () => {
    setShowCounsellingReport(false);
  };

  // Handle download PDF report from View Counselling Report modal
  const handleDownloadPDFFromView = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Downloading PDF report from View Counselling Report modal...");
      
      // Use the exact same data that's shown in the View Counselling Report modal
      const viewData = lastScheduledStudent;
      
      console.log("Using View Counselling Report data:");
      console.log("viewData:", viewData);
      
      // Find the complete student details from the mentees array
      const completeStudentDetails = mentees.find(m => m.student_name === viewData.student_name);
      console.log("Complete student details:", completeStudentDetails);
      
      // Send the exact same data that's shown in the view modal + complete student details
      const response = await fetch('http://localhost:7048/api/counselling-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_name: viewData.student_name,
          date: viewData.date,
          time: viewData.time,
          location: viewData.location,
          description: viewData.description,
          // Use complete student details from mentees array
          student_id: completeStudentDetails ? completeStudentDetails.student_id : viewData.student_id,
          department: completeStudentDetails ? completeStudentDetails.department : viewData.department,
          year: completeStudentDetails ? completeStudentDetails.year : viewData.year,
          section: completeStudentDetails ? completeStudentDetails.section : viewData.section
        })
      });

      console.log("PDF response status:", response.status);

      if (response.ok) {
        // Convert response to blob
        const blob = await response.blob();
        console.log("PDF blob created:", blob.size);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from response headers or create default
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'counselling-report.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log("PDF downloaded successfully!");
        alert('Counselling report downloaded successfully!');
      } else {
        const errorData = await response.json();
        console.log("PDF error response:", errorData);
        alert('Failed to download report: ' + (errorData.message || errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download report: ' + error.message);
    }
  };

  // Handle download PDF report
  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Downloading PDF report with current form data...");
      
      // Debug: Check what data is in the current form
      console.log("Using current form data (what mentor entered):");
      console.log("selectedCounsellingMentee:", selectedCounsellingMentee);
      console.log("counsellingDate:", counsellingDate);
      console.log("counsellingTime:", counsellingTime);
      console.log("counsellingLocation:", counsellingLocation);
      console.log("counsellingDescription:", counsellingDescription);
      
      // Find the student details for the selected student
      const selectedStudent = mentees.find(m => m.student_name === selectedCounsellingMentee);
      console.log("Selected student details:", selectedStudent);
      
      // Send the current form data that mentor just entered
      const response = await fetch('http://localhost:7048/api/counselling-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_name: selectedCounsellingMentee,
          date: counsellingDate,
          time: counsellingTime,
          location: counsellingLocation,
          description: counsellingDescription,
          // Include student details for complete information
          student_id: selectedStudent ? selectedStudent.student_id : 'N/A',
          department: selectedStudent ? selectedStudent.department : 'N/A',
          year: selectedStudent ? selectedStudent.year : 'N/A',
          section: selectedStudent ? selectedStudent.section : 'N/A'
        })
      });

      console.log("PDF response status:", response.status);

      if (response.ok) {
        // Convert response to blob
        const blob = await response.blob();
        console.log("PDF blob created:", blob.size);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from response headers or create default
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'counselling-report.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log("PDF downloaded successfully!");
        alert('Counselling report downloaded successfully!');
      } else {
        const errorData = await response.json();
        console.log("PDF error response:", errorData);
        alert('Failed to download report: ' + (errorData.message || errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download report: ' + error.message);
    }
  };
  const handleAddCounselling = async () => {
    if (!selectedCounsellingMentee || !counsellingDate || !counsellingTime || !counsellingLocation || !counsellingDescription) {
      alert('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log("Adding counselling:", {
        student_name: selectedCounsellingMentee,
        mentorId: mentorId,
        date: counsellingDate,
        time: counsellingTime,
        location: counsellingLocation,
        description: counsellingDescription,
        token: token ? "exists" : "missing"
      });

      const response = await fetch('http://localhost:7048/api/counselling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_name: selectedCounsellingMentee,
          mentorId: mentorId,
          date: counsellingDate,
          time: counsellingTime,
          location: counsellingLocation,
          description: counsellingDescription
        })
      });

      console.log("Counselling response status:", response.status);
      console.log("Counselling response ok:", response.ok);

      if (response.ok) {
        const newCounselling = await response.json();
        console.log("New counselling saved from backend:", newCounselling);
        
        // The backend response should already include student details
        // Use the backend response directly instead of frontend lookup
        setCounsellingRecords(prev => [...prev, newCounselling]);
        
        // Set the last scheduled student with details from backend response
        setLastScheduledStudent(newCounselling);
        
        console.log("Last scheduled student set to:", newCounselling);
        
        alert('Counselling scheduled successfully!');
        
        // Reset form and close modal
        setSelectedCounsellingMentee('');
        setCounsellingDate('');
        setCounsellingTime('');
        setCounsellingLocation('');
        setCounsellingDescription('');
        setShowScheduleCounselling(false);
      } else {
        const errorData = await response.json();
        console.log("Counselling error response:", errorData);
        alert('Failed to schedule counselling: ' + (errorData.message || errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error scheduling counselling:', error);
      alert('Failed to schedule counselling: ' + error.message);
    }
  };

  return (
    <div className="mentee-list-container">
      <h2>Mentee List</h2>
      
      {/* Action Buttons */}
      <div className="action-buttons-section">
        <button className="add-student-button" onClick={handleAddStudentClick}>
          + Add New Student
        </button>
        <button className="schedule-counselling-button" onClick={handleScheduleCounsellingClick}>
          Schedule Counselling
        </button>
        <button className="download-pdf-button" onClick={handleShowCounsellingReport}>
          View Counselling Report
        </button>
      </div>

      <div className="table-container">
        <table className="mentee-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>S.No</th>
              <th style={{ width: '25%' }}>Name of Student</th>
              <th style={{ width: '15%' }}>Department</th>
              <th style={{ width: '10%' }}>Year</th>
              <th style={{ width: '10%' }}>Section</th>
              <th style={{ width: '10%' }}>Semester</th>
              <th style={{ width: '20%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee, index) => (
              <tr key={mentee._id}>
                <td>{index + 1}</td>
                <td>
                  {editingStudent?._id === mentee._id ? (
                    <input
                      type="text"
                      name="student_name"
                      value={editFormData.student_name}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    mentee.student_name ? mentee.student_name.split(' ')[0] : 'Student ' + (index + 1)
                  )}
                </td>
                <td>
                  {editingStudent?._id === mentee._id ? (
                    <input
                      type="text"
                      name="department"
                      value={editFormData.department}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    mentee.department || 'CSE'
                  )}
                </td>
                <td>
                  {editingStudent?._id === mentee._id ? (
                    <input
                      type="number"
                      name="year"
                      value={editFormData.year}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    mentee.year || 'III'
                  )}
                </td>
                <td>
                  {editingStudent?._id === mentee._id ? (
                    <input
                      type="text"
                      name="section"
                      value={editFormData.section}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Section"
                    />
                  ) : (
                    mentee.section || 'A'
                  )}
                </td>
                <td>
                  {editingStudent?._id === mentee._id ? (
                    <input
                      type="number"
                      name="semester"
                      value={editFormData.semester}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Semester"
                    />
                  ) : (
                    mentee.semester || '1'
                  )}
                </td>
                <td>
                  {editingStudent?._id === mentee._id ? (
                    <div className="edit-actions">
                      <button className="save-button-inline" onClick={handleSaveEdit}>
                        Save
                      </button>
                      <button className="cancel-button-inline" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button className="view-button" onClick={() => handleClick(mentee)}>
                        Click
                      </button>
                      <button className="edit-button" onClick={() => handleEditClick(mentee)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteStudent(mentee._id, mentee.student_name)}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMentee && (
        <div className="semester-buttons">
          <h3>Select Semester</h3>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              className={`semester-button ${selectedSemester === sem ? 'active' : ''}`}
              onClick={() => handleSemesterClick(sem)}
            >
              {sem}
            </button>
          ))}
        </div>
      )}

      {selectedMentee && (
        <div className="action-buttons">
          <button className="view-marks-button" onClick={handleViewMarks}>
            View Marks
          </button>
          <button className="view-low-marks-button" onClick={handleViewLowMarksStudents}>
            View Low Marks Students
          </button>
          <button className="counselling-button" onClick={handleSaveAndDownload}>
            Counselling Report
          </button>
        </div>
      )}

      
      {/* Selected Student Display */}
      {selectedMentee && (
        <div className="selected-student-display">
          <h3>Selected Student: {selectedMentee.student_name}</h3>
        </div>
      )}

      {/* Add Student Form */}
      {addingStudent && (
        <div className="add-student-form">
          <h3>Add New Student</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Student Name:</label>
              <input
                type="text"
                name="student_name"
                value={addFormData.student_name}
                onChange={handleAddChange}
                className="input-field"
                placeholder="Enter student name"
              />
            </div>
            <div className="form-group">
              <label>Student ID:</label>
              <input
                type="text"
                name="student_id"
                value={addFormData.student_id}
                onChange={handleAddChange}
                className="input-field"
                placeholder="Enter student ID"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={addFormData.department}
                onChange={handleAddChange}
                className="input-field"
                placeholder="e.g., CSE"
              />
            </div>
            <div className="form-group">
              <label>Year:</label>
              <input
                type="number"
                name="year"
                value={addFormData.year}
                onChange={handleAddChange}
                className="input-field"
                placeholder="e.g., 3"
                min="1"
                max="4"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Section:</label>
              <input
                type="text"
                name="section"
                value={addFormData.section}
                onChange={handleAddChange}
                className="input-field"
                placeholder="e.g., A"
              />
            </div>
            <div className="form-group">
              <label>Semester:</label>
              <input
                type="number"
                name="semester"
                value={addFormData.semester}
                onChange={handleAddChange}
                className="input-field"
                placeholder="e.g., 1"
                min="1"
                max="8"
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="save-button" onClick={handleSaveNewStudent}>
              Add Student
            </button>
            <button className="cancel-button" onClick={handleCancelAdd}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Schedule Counselling Form */}
      {showScheduleCounselling && (
        <div className="counselling-form-overlay">
          <div className="counselling-form-modal">
            <div className="form-header">
              <h3>Schedule New Counselling</h3>
              <button className="close-form-button" onClick={() => setShowScheduleCounselling(false)}>
                ✕
              </button>
            </div>
            
            <div className="form-content">
              <div className="form-group">
                <label>Select Student:</label>
                <select 
                  value={selectedCounsellingMentee} 
                  onChange={(e) => setSelectedCounsellingMentee(e.target.value)}
                  className="select-field"
                >
                  <option value="">Choose a student...</option>
                  {mentees.map((mentee) => (
                    <option key={mentee._id} value={mentee.student_name}>
                      {mentee.student_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Date:</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={counsellingDate}
                  onChange={(e) => setCounsellingDate(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Time:</label>
                <input 
                  type="time" 
                  className="input-field"
                  value={counsellingTime}
                  onChange={(e) => setCounsellingTime(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Location:</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="Enter location"
                  value={counsellingLocation}
                  onChange={(e) => setCounsellingLocation(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  className="textarea-field"
                  placeholder="Enter counselling description"
                  value={counsellingDescription}
                  onChange={(e) => setCounsellingDescription(e.target.value)}
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  className="submit-button"
                  onClick={handleAddCounselling}
                >
                  Schedule Counselling
                </button>
                <button 
                  className="download-pdf-button"
                  onClick={handleDownloadPDF}
                >
                  Download PDF Report
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => setShowScheduleCounselling(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Counselling Report Display */}
      {showCounsellingReport && (
        <div className="counselling-report-overlay">
          <div className="counselling-report-modal">
            <div className="report-header">
              <h2>Student Counselling Report</h2>
              <button className="close-report-button" onClick={handleCloseReport}>
                ✕
              </button>
            </div>
            
            <div className="report-content">
              {/* Mentor Information */}
              <div className="report-section">
                <h3>Mentor Information</h3>
                <div className="mentor-info">
                  <p><strong>Mentor ID:</strong> {mentorId}</p>
                  <p><strong>Report Generated:</strong> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Detailed Records */}
              <div className="report-section">
                <h3>Counselling Report</h3>
                
                {lastScheduledStudent ? (
                  <div className="single-student-report">
                    <div className="student-info">
                      <h4>Student Information</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Student Name:</label>
                          <span>{lastScheduledStudent.student_name}</span>
                        </div>
                        <div className="info-item">
                          <label>Student ID:</label>
                          <span>{lastScheduledStudent.student_id || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Department:</label>
                          <span>{lastScheduledStudent.department || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Year:</label>
                          <span>{lastScheduledStudent.year || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Section:</label>
                          <span>{lastScheduledStudent.section || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Counselling Date:</label>
                          <span>{lastScheduledStudent.date}</span>
                        </div>
                        <div className="info-item">
                          <label>Counselling Time:</label>
                          <span>{lastScheduledStudent.time}</span>
                        </div>
                        <div className="info-item">
                          <label>Location:</label>
                          <span>{lastScheduledStudent.location}</span>
                        </div>
                        <div className="info-item">
                          <label>Description:</label>
                          <span>{lastScheduledStudent.description}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mentor-info">
                      <h4>Mentor Information</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Mentor ID:</label>
                          <span>{mentorId}</span>
                        </div>
                        <div className="info-item">
                          <label>Report Generated:</label>
                          <span>{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-records">
                    <p>No counselling scheduled yet. Please schedule counselling first.</p>
                  </div>
                )}
              </div>

              {/* Report Actions */}
              <div className="report-actions">
                <button className="download-pdf-button" onClick={handleDownloadPDFFromView}>
                  📄 Download PDF Report
                </button>
                <button className="close-report-button" onClick={handleCloseReport}>
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marks Table Modal */}
      {showSubjectMarks && selectedMarksStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Select Semester</h2>
              <button className="close-button" onClick={closeMarksModal}>×</button>
            </div>
            <div className="semester-buttons">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  className={`semester-button ${selectedMarksSemester === sem ? 'selected' : ''}`}
                  onClick={() => handleSemesterSelect(sem)}
                >
                  Semester {sem}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedMarksSemester && selectedMarksStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Semester {selectedMarksSemester} - {selectedMarksStudent.student_name}</h2>
              <button className="close-button" onClick={closeMarksModal}>×</button>
            </div>
            {renderMarksTable()}
            <div className="modal-footer">
              <button className="save-button" onClick={handleMarksSaveAndDownload}>
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
