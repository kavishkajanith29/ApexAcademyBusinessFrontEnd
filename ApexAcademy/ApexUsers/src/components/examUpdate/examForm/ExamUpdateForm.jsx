import { useEffect, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate, useParams } from "react-router-dom";

const TABLE_HEADS = [
  "Select",
  "Subject ID",
  "Student ID",
  "Exam Name",
  "Exam Date",
  "Marks",
  "View",
];

function ExamUpdateForm() {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [subject, setSubject] = useState([]);
  const [exam, setExam] = useState([]);
  const [student, setStudent] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [mark, setMark] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [markFilter, setMarkFilter] = useState([]);
  const { id } = useParams(); 
  const [studentFilter, setStudentFilter] = useState("");
  const [examDescriptionFilter, setExamDescriptionFilter] = useState("");
  const [examDescriptions, setExamDescriptions] = useState([]);
  const [marksRangeFilter, setMarksRangeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editedMark, setEditedMark] = useState({ markId: null, newMark: null });
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const teacherId = localStorage.getItem('teacherId');

  // Create a reference for the Select component
  const studentSelectRef = useRef(null);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/subject/all');
        const filteredEnrollments = response.data.filter(enrollment => 
          enrollment.teacher.teacherid === teacherId
        );
        setSubject(filteredEnrollments);
      } catch (error) {
        console.error('Error fetching enrollments', error);
      }
    };

    fetchSubject();
  }, [teacherId]);

  useEffect(() => {
    const fetchExam = async () => {
      if (subjectId) {
        try {
          const response = await axios.get(`http://localhost:8085/api/v1/exam/subject/${subjectId}`);
          setExam(response.data);
        } catch (error) {
          console.error('Error fetching enrollments', error);
        }
      }
    };

    fetchExam();
  }, [subjectId]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (subjectId) {
        try {
          const response = await axios.get(`http://localhost:8085/api/v1/enrollment/subject/${subjectId}`);
          setStudent(response.data);
        } catch (error) {
          console.error('Error fetching enrollments', error);
        }
      }
    };

    fetchStudent();
  }, [subjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/v1/mark/assign', {
        studentId,
        examId,
        mark
      });
      if(response.data === "Mark already assigned for this exam."){
        setResponseMessage(`${studentId}  Mark already assigned.`);
      }else if(response.data.exam){
        setResponseMessage(`Student ${studentId} marks ${mark}%  Mark assigned successfully.`);
        setStudentId('');
        setMark('');
        if (studentSelectRef.current) {
          studentSelectRef.current.clearValue();
        }
      }
    } catch (error) {
      setResponseMessage('Error assigning mark');
    }
  };

  const handleSubjectChange = (e) => {
    setSubjectId(e.target.value);
    setExamId(''); // Reset exam ID when subject changes
    setExam([]); // Clear exams list when subject changes
  };

  const handleExamChange = (e) => {
    setExamId(e.target.value);
  };

  const handleStudentChange = (selectedOption) => {
    setStudentId(selectedOption ? selectedOption.value : '');
  };

  const handleMarksChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
      setMark(value);
    }
  };

  const handleInputChange = (inputValue, { action }) => {
    if (action === 'input-change') {
      return inputValue.toUpperCase();
    }
    return inputValue;
  };


  useEffect(() => {
    const fetchMarksDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/mark/all");
        const filteredMarksDetails = response.data.filter(enrollment => 
          enrollment.exam.subject.teacher.teacherid === teacherId
        );
        setMarkFilter(filteredMarksDetails);
        // const descriptions = Array.from(new Set(filteredMarksDetails.map(mark => mark.exam.description)));
        // setExamDescriptions(descriptions);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching marks details:", error);
      }
    };

    fetchMarksDetails();
  }, [id]);

  const totalPages = Math.ceil(markFilter.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleStudentFilterChange = (e) => {
    setStudentFilter(e.target.value);
  };

  const handleExamDescriptionFilterChange = (e) => {
    setExamDescriptionFilter(e.target.value);
  };

  const handleMarksRangeFilterChange = (e) => {
    setMarksRangeFilter(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const getFilteredMarks = () => {
    return markFilter.filter((mark) => {
      const matchesStudentFilter = studentFilter === "" || mark.student.studentid.toString().includes(studentFilter);
      const matchesExamDescriptionFilter = examDescriptionFilter === "" || mark.exam.description.includes(examDescriptionFilter);

      const matchesMarksRangeFilter = (() => {
        if (marksRangeFilter === "75-100") return mark.mark >= 75 && mark.mark <= 100;
        if (marksRangeFilter === "65-74") return mark.mark >= 65 && mark.mark < 75;
        if (marksRangeFilter === "55-64") return mark.mark >= 55 && mark.mark < 65;
        if (marksRangeFilter === "40-54") return mark.mark >= 40 && mark.mark < 55;
        if (marksRangeFilter === "0-39") return mark.mark >= 0 && mark.mark < 40;
        return true;
      })();

      return matchesStudentFilter && matchesExamDescriptionFilter && matchesMarksRangeFilter;
    });
  };

  const getVisibleMarks = () => {
    const filteredMarks = getFilteredMarks();

    if (sortOrder === "asc") {
      filteredMarks.sort((a, b) => a.mark - b.mark);
    } else {
      filteredMarks.sort((a, b) => b.mark - a.mark);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredMarks.length);
    return filteredMarks.slice(startIndex, endIndex);
  };
  const handleEdit = (markId, currentMark) => {
    setEditedMark({ markId, newMark: currentMark });
  };

    // Handle save button click after editing a mark
    const handleSave = async (markId) => {
      try {
        const response = await axios.put(`http://localhost:8085/api/v1/mark/update/${markId}`, {
          marks: editedMark.newMark,
        });
        if (response.status === 200) {
          setMarkFilter((prevMarks) =>
            prevMarks.map((mark) => (mark.markId === markId ? { ...mark, mark: editedMark.newMark } : mark))
          );
          setEditedMark({ markId: null, newMark: null });
        }
      } catch (error) {
        console.error('Error updating mark:', error);
      }
    };
  
    const handleCheckboxChange = (markId) => {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.includes(markId)
          ? prevSelectedRows.filter((id) => id !== markId)
          : [...prevSelectedRows, markId]
      );
    };
  
    // Handle delete button click
    const handleDelete = async () => {
      try {
        await Promise.all(
          selectedRows.map((markId) =>
            axios.delete(`http://localhost:8085/api/v1/mark/${markId}`)
          )
        );
        setSelectedRows([]);
        // Refresh the mark list
        const response = await axios.get("http://localhost:8085/api/v1/mark/all");
        const filteredMarksDetails = response.data.filter(enrollment => 
          enrollment.exam.subject.teacher.teacherid === teacherId
        );
        setMarkFilter(filteredMarksDetails);
      } catch (error) {
        console.error('Error deleting marks', error);
      }
    };


    

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label>Select Subject</Form.Label>
            <Form.Select aria-label="Default select example" onChange={handleSubjectChange}>
              <option>Select the Subject</option>
              {subject.map((item) => (
                <option key={item.subjectid} value={item.subjectid}>{item.subjectid}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Select Exam</Form.Label>
            <Form.Select aria-label="Default select example" onChange={handleExamChange} disabled={!subjectId}>
              <option>Select the Exam</option>
              {exam.map((item) => (
                <option key={item.examId} value={item.examId}>{item.description}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {subjectId && examId && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Select Student ID</Form.Label>
                <Select 
                  ref={studentSelectRef}
                  options={student.map((item) => ({ value: item.student.studentid, label: item.student.studentid }))}
                  onChange={handleStudentChange}
                  onInputChange={handleInputChange}
                  isClearable
                  required
                  placeholder="Select or type to search"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Enter Marks</Form.Label>
                <Form.Control 
                  type="number"
                  min="0"
                  max="100" 
                  required
                  placeholder="Enter Marks" 
                  value={mark} 
                  onChange={handleMarksChange}
                />
              </Form.Group>
            </>
          )}
          <Button type="submit">Submit</Button>
        </fieldset>
      </Form>
      {responseMessage && <div style={{textAlign:"center", color:"red",fontSize:"24px"}} className="mt-3">{responseMessage}</div>}

      <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Exam Marks</h4>
      </div>
      <div className="filter-container" style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Filter by Student ID"
          value={studentFilter}
          onChange={handleStudentFilterChange}
        />
        <select value={examDescriptionFilter} onChange={handleExamDescriptionFilterChange} style={{ marginLeft: 10, padding: 5 }}>
          <option value="">All Exams</option>
          {examDescriptions.map((description, index) => (
            <option key={index} value={description}>
              {description}
            </option>
          ))}
        </select>
        <select value={marksRangeFilter} onChange={handleMarksRangeFilterChange} style={{ marginLeft: 10, padding: 5 }}>
          <option value="">All Marks</option>
          <option value="75-100">Marks 75-100</option>
          <option value="65-74">Marks 65-74</option>
          <option value="55-64">Marks 55-64</option>
          <option value="40-54">Marks 40-54</option>
          <option value="0-39">Marks 0-39</option>
        </select>
        <select value={sortOrder} onChange={handleSortOrderChange} style={{ marginLeft: 10, padding: 5 }}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
      {getVisibleMarks().map((dataItem) => (
        <tr key={dataItem.markId}>
           <td>
           <input
              type="checkbox"
              checked={selectedRows.includes(dataItem.markId)} // Ensure this correctly reflects the selection state
              onChange={() => handleCheckboxChange(dataItem.markId)}
          />
           </td>
          <td>{dataItem.exam.subject.subjectid}</td>
          <td>{dataItem.student.studentname}</td>
          <td>{dataItem.exam.description}</td>
          <td>{dataItem.exam.examDate}</td>
          {/* <td>{dataItem.mark}</td> */}
          <td>
                    {editedMark.markId === dataItem.markId ? (
                      <input
                        type="number"
                        value={editedMark.newMark}
                        min="0"
                        max="100"
                        onChange={(e) => setEditedMark({ ...editedMark, newMark: e.target.value })}
                        
                      />
                    ) : (
                      dataItem.mark
                    )}
          </td>
          <td className="dt-cell-action">
                    {editedMark.markId === dataItem.markId ? (
                      <Button
                        style={{ backgroundColor: "#28a745" }}
                        onClick={() => handleSave(dataItem.markId)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        style={{ backgroundColor: "#007bff" }}
                        onClick={() => handleEdit(dataItem.markId, dataItem.mark)}
                      >
                        Edit
                      </Button>
                    )}
          </td>
        </tr>
      ))}
    </tbody>

        </table>
        {totalPages > 1 && (
          <div className="data-table-navigation">
            <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={handlePrev}>
              Prev
            </Button>
            <span style={{ marginLeft: '10px', marginRight: '10px' }}>
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={handleNext}>
              Next
            </Button>
            <span className="dropnavigation">
              <select
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value))}
                style={{
                  fontSize: '16px',
                  marginLeft: '10px',
                  paddingRight: '10px',
                  paddingBottom: '5px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#333'
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </span>
          </div>
        )}
      </div>

      {/* Adding the Pie Chart Component */}
      {/* <div className="pie-chart-container" style={{marginTop:25}}>
        <PieActiveArc />
      </div> */}
       <Button variant="danger" onClick={handleDelete} disabled={selectedRows.length === 0} style={{color:"red",border:"1px soild", padding:"0.5rem"}}>
          Delete Selected
        </Button>
    </section>
    </div>
  );
}

export default ExamUpdateForm;
