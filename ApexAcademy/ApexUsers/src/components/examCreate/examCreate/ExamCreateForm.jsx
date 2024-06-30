import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ExamCreateForm() {
  const [subject, setSubject] = useState([]);
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examDate, setExamDate] = useState('');
  const [exams, setExams] = useState([]);
  const [checkedExams, setCheckedExams] = useState(new Set());
  const [examId, setExamId] = useState(null);
  const [editExamDate, setEditExamDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
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

    const fetchExams = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/exam/recent');
        setExams(response.data);
      } catch (error) {
        console.error('Error fetching exams', error);
      }
    };

    fetchSubject();
    fetchExams();
  }, [teacherId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/v1/exam/add', {
        subjectId,
        examDate,
        description
      });
      setExams([...exams, response.data]);
      setSubjectId('');
      setExamDate('');
      setDescription('');
      window.location.reload(); 
    } catch (error) {
      console.error('Error assigning exam', error);
    }
  };

  const handleCheckboxChange = (exam) => {
    const newCheckedExams = new Set(checkedExams);
    if (newCheckedExams.has(exam.examId)) {
      newCheckedExams.delete(exam.examId);
    } else {
      newCheckedExams.add(exam.examId);
    }
    setCheckedExams(newCheckedExams);
  };

  const handleDelete = async () => {
    const examsToDelete = Array.from(checkedExams);
    try {
      await Promise.all(
        examsToDelete.map(examId =>
          axios.delete(`http://localhost:8085/api/v1/exam/${examId}`)
        )
      );
      const newExams = exams.filter(exam => !checkedExams.has(exam.examId));
      setExams(newExams);
      setCheckedExams(new Set());
    } catch (error) {
      console.error('Error deleting exams', error);
    }
  };

  const handleEdit = (exam) => {
    setExamId(exam.examId);
    setEditExamDate(exam.examDate);
    setEditDescription(exam.description);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8085/api/v1/exam/update/${examId}`, {
        examDate: editExamDate,
        description: editDescription
      });
      const updatedExams = exams.map(exam => 
        exam.examId === examId ? response.data : exam
      );
      setExams(updatedExams);
      setExamId(null);
      setEditExamDate('');
      setEditDescription('');
      window.location.reload(); 
    } catch (error) {
      console.error('Error updating exam', error);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label>Select Subject</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={subjectId}
              required
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option>Select the Subject</option>
              {subject.map((item) => (
                <option key={item.subjectid} value={item.subjectid}>{item.subjectid}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Enter Date</Form.Label>
            <Form.Control
              type="date"
              required
              placeholder="Enter Date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Enter Exam Name</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter Exam Name"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button type="submit">Create Exam</Button>
        </fieldset>
      </Form>

      {exams.length > 0 && (
        <div>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Select</th>
                <th>Subject ID</th>
                <th>Exam Date</th>
                <th>Description</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.examId}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      onChange={() => handleCheckboxChange(exam)}
                      checked={checkedExams.has(exam.examId)}
                    />
                  </td>
                  <td>{exam.subject?.subjectid}</td>
                  <td>
                    {examId === exam.examId ? (
                      <Form.Control
                        type="date"
                        value={editExamDate}
                        onChange={(e) => setEditExamDate(e.target.value)}
                      />
                    ) : (
                      exam.examDate
                    )}
                  </td>
                  <td>
                    {examId === exam.examId ? (
                      <Form.Control
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    ) : (
                      exam.description
                    )}
                  </td>
                  <td>
                    {examId === exam.examId ? (
                      <Button variant="success" onClick={handleSave} style={{ color: 'green', border: '1px solid', padding: '0.5rem' }}>
                        Save
                      </Button>
                    ) : (
                      <Button variant="warning" onClick={() => handleEdit(exam)} style={{ color: 'blue', border: '1px solid', padding: '0.5rem' }}>
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="danger" onClick={handleDelete} style={{ color: 'red', border: '1px solid', padding: '0.5rem' }}>
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
}

export default ExamCreateForm;
