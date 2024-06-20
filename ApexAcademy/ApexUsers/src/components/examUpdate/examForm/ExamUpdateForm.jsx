import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


function ExamUpdateForm() {

  const [subject, setSubject] = useState([]);
  const [exam, setExam] = useState([]);
  const [student, setStudent] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [mark, setMark] = useState('');
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/subject/all`);
        // setEnrollments(response.data);
         console.log(response.data)
         console.log("Here")
         const filteredEnrollments = response.data.filter(enrollment => 
           enrollment.teacher.teacherid === teacherId
         );
         setSubject(filteredEnrollments);
         console.log(filteredEnrollments);
        console.log("Here11")
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
         console.log(response.data)
         console.log("Here")
        //  const filteredEnrollments = response.data.filter(enrollment => 
        //    enrollment.teacher.teacherid === teacherId
        //  );
        //  setSubject(filteredEnrollments);
        //  console.log(filteredEnrollments);
        // console.log("Here11")
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
         console.log(response.data)
         console.log("Here")
        //  const filteredEnrollments = response.data.filter(enrollment => 
        //    enrollment.teacher.teacherid === teacherId
        //  );
        //  setSubject(filteredEnrollments);
        //  console.log(filteredEnrollments);
        // console.log("Here11")
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
      console.log('Mark assigned successfully', response.data);
      setStudentId('');
      setMark('');
    } catch (error) {
      console.error('Error assigning mark', error);
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
  const handleStudentChange = (e) => {
    setStudentId(e.target.value);
  };

  const handleMarksChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
      setMark(value);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <fieldset>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Select Subject</Form.Label>
          {/* <Form.Control id="disabledTextInput" placeholder="Select Subject" /> */}
          <Form.Select aria-label="Default select example" onChange={handleSubjectChange}>
              <option >Select the Subject</option>
              {
                subject.map((item)=>{
                  return (<option key={item.subjectid} value={item.subjectid}>{item.subjectid}</option>)
                })
              }
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Select Exam</Form.Label>
          <Form.Select aria-label="Default select example" onChange={handleExamChange} disabled={!subjectId}>
              <option>Select the Exam</option>
              {
                exam.map((item)=>{
                  return (<option key={item.examId} value={item.examId}>{item.description}</option>)
                })
              }
          </Form.Select>
        </Form.Group>


        {subjectId && examId && (
          <>
        <Form.Group className="mb-3">
        
          <Form.Label htmlFor="disabledTextInput">Select Student ID</Form.Label>
          {/* <Form.Control id="disabledTextInput" placeholder="Select Subject" /> */}
          <Form.Select aria-label="Default select example" 
          value={studentId}
          onChange={handleStudentChange}>
              <option>Select the Student ID</option>
              {
                student.map((item)=>{
                  return (<option key={item.student.studentid} value={item.student.studentid}>{item.student.studentid}</option>)
                })
              }
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Enter Marks</Form.Label>
          <Form.Control id="disabledNumberInput" 
                type="number"
                min="0"
                max="100" placeholder="Enter Marks" value={mark} onChange={handleMarksChange}/>
        </Form.Group>
        </>
        )}
        
        <br/>
        <Button type="submit">Submit</Button>
      </fieldset>
    </Form>
  );
}

export default ExamUpdateForm;