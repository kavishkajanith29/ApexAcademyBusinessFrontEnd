import { useEffect, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Select from 'react-select';

function ExamUpdateForm() {
  const [subject, setSubject] = useState([]);
  const [exam, setExam] = useState([]);
  const [student, setStudent] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [mark, setMark] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
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
    </div>
  );
}

export default ExamUpdateForm;
