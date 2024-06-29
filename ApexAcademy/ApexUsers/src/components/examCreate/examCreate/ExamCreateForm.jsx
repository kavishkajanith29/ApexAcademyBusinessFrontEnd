import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


function ExamCreateForm() {

  const [subject, setSubject] = useState([]);
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examDate, setExamDate] = useState('');
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/subject/all`);
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


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/v1/exam/add', {
        subjectId,
        examDate,
        description
      });
      setSubjectId('');
      setExamDate('');
      setDescription('');
    } catch (error) {
      console.error('Error assigning exam', error);
    }
  };


  return (
    <Form onSubmit={handleSubmit}>
      <fieldset>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Select Subject</Form.Label>
          <Form.Select aria-label="Default select example" value={subjectId} required
            onChange={(e) => setSubjectId(e.target.value)} >
              <option >Select the Subject</option>
              {
                subject.map((item)=>{
                  return (<option key={item.subjectid} value={item.subjectid}>{item.subjectid}</option>)
                })
              }
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Enter Date</Form.Label>
          <Form.Control id="disabledNumberInput" 
                type="Date"
                required
                placeholder="Enter Date" value={examDate} 
                onChange={(e) => setExamDate(e.target.value)} />
                
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Enter Exam Name</Form.Label>
          <Form.Control id="disabledNumberInput" 
                type="text"
                required
                placeholder="Enter Exam Name" value={description} 
                onChange={(e) => setDescription(e.target.value)}/>
        </Form.Group>
        
        <br/>
        <Button type="submit">Create Exam</Button>
      </fieldset>
    </Form>
  );
}

export default ExamCreateForm;