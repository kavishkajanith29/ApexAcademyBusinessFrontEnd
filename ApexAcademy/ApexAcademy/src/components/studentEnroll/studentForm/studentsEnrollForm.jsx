import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './form.css';
import { useState } from 'react';
import Swal from 'sweetalert2';

function StudentsEnrollForm() {
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8085/api/v1/enrollment/enroll', formData);
      
      if (response.data.statusCodeValue === 200) {
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Enrollment Successful',
          text: 'Student enrolled in subject successfully!',
        });
      } else {
        // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Failed to Enroll Student in Subject.',
        text: response.data.body,
      });
      }

    } catch (error) {
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to enroll student in subject. Please try again.',
      });
    }
  };

  return (
    <div className="clssregister">
      <div>
        <h2 style={{textAlign:"center",marginBottom:50}}>New Student Enrollment</h2>
      </div>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="studentId">Student Id</Form.Label>
            <Form.Control
              id="studentId"
              placeholder="Enter Student Id"
              onChange={handleChange}
              value={formData.studentId}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="subjectId">Subject Id</Form.Label>
            <Form.Control
              id="subjectId"
              placeholder="Enter Subject Id"
              onChange={handleChange}
              value={formData.subjectId}
              required
            />
          </Form.Group>

          <Button type="submit">Enroll</Button>
        </fieldset>
      </Form>
    </div>
  );
}

export default StudentsEnrollForm;
