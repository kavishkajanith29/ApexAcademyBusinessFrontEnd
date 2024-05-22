import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './form.css';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function ClassesForm() {
  const initialFormData = {
    subjectid: '',
    teacherId: '',
    subjectname: '',
    medium: '',
    day: '',
    startTime: '08:00',
    endTime: '10:00',
    classfee: '',
    exam: '',
    examYear: '',
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [years, setYears] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    if (id === 'medium') {
      fetchClassFee(value);
    }
  };

  const fetchClassFee = async (medium) => {
    try {
      const response = await axios.get('http://localhost:8085/classfee/all');
      const fees = response.data;
      const fee = fees.find(fee => fee.medium === medium)?.fee || '';
      setFormData((prevFormData) => ({
        ...prevFormData,
        classfee: fee,
      }));
    } catch (error) {
      console.error('Error fetching class fees:', error);
    }
  };

  const handleExamChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      exam: value,
      examYear: '',
    });

    const currentYear = new Date().getFullYear();
    if (value === 'AL') {
      setYears([currentYear, currentYear + 1, currentYear + 2]);
    } else if (value === 'OL') {
      setYears([currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4, currentYear + 5]);
    }
  };

  const generateSubjectId = () => {
    const { exam, subjectname, examYear } = formData;
    if (exam && subjectname && examYear) {
      return exam + examYear + subjectname.slice(0, 3).toUpperCase();
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectid = generateSubjectId();
    if (!subjectid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please ensure all required fields are filled and exam year is selected.',
      });
      return;
    }

    const timeRange = `${formData.startTime} - ${formData.endTime}`;

    const dataToSend = {
      subjectid,
      teacherId: formData.teacherId,
      subjectname: formData.subjectname,
      medium: formData.medium,
      day: formData.day,
      timeRange,
      classfee: formData.classfee,
    };

    try {
      const response = await axios.post('http://localhost:8085/api/v1/subject/add', dataToSend);

      Swal.fire({
        icon: 'success',
        title: 'Class Registration Successful!',
        text: 'Class has been registered successfully.',
      });
      navigate(`/classes`);

      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Failed to register class. Please try again later.',
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setYears([]);
  };

  return (
    <div className="classregister">
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="teacherId">Teacher ID *</Form.Label>
            <Form.Control
              id="teacherId"
              placeholder="Enter Teacher ID"
              onChange={handleChange}
              value={formData.teacherId}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="subjectname">Subject Name *</Form.Label>
            <Form.Control
              id="subjectname"
              placeholder="Enter Subject Name"
              onChange={handleChange}
              value={formData.subjectname}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="medium">Medium *</Form.Label>
            <Form.Select id="medium" aria-label="Medium" onChange={handleChange} value={formData.medium} required>
              <option>Select the medium</option>
              <option value="SINHALA">Sinhala</option>
              <option value="ENGLISH">English</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="day">Day *</Form.Label>
            <Form.Select id="day" aria-label="Day" onChange={handleChange} value={formData.day} required>
              <option>Select the day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="startTime">Start Time *</Form.Label>
            <Form.Control
              type="time"
              id="startTime"
              onChange={handleChange}
              value={formData.startTime}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="endTime">End Time *</Form.Label>
            <Form.Control
              type="time"
              id="endTime"
              onChange={handleChange}
              value={formData.endTime}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="exam">Exam *</Form.Label>
            <Form.Select id="exam" aria-label="Exam" onChange={handleExamChange} value={formData.exam} required>
              <option>Select the exam</option>
              <option value="AL">A/L</option>
              <option value="OL">O/L</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Exam Year *</Form.Label>
            <Form.Select id="examYear" aria-label="Exam Year" onChange={handleChange} value={formData.examYear} required>
              <option>Select the year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="classfee">Class Fee</Form.Label>
            <Form.Control
              id="classfee"
              placeholder="Enter Class Fee"
              value={formData.classfee ? `RS.${formData.classfee}.00` : ''}
              readOnly
            />
          </Form.Group>

          <Button type="submit">Register</Button>
        </fieldset>
      </Form>
    </div>
  );
}

export default ClassesForm;
