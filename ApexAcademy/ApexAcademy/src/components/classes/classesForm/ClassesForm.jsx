import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './form.css';
import { useState,useEffect } from 'react';
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

  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState(initialFormData);
  const [years, setYears] = useState([]);

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setFormData({
      ...formData,
      [name || id]: value
    });
  };

  useEffect(() => {
    if (formData.medium && formData.exam) {
      fetchClassFee(formData.medium, formData.exam);
    }
  }, [formData.medium, formData.exam]);



  const fetchClassFee = async (medium, exam) => {
    try {
      const grade = exam === "OL" ? "O/L" : "A/L";
      
      const response = await axios.get('http://localhost:8085/classfee/all');
      const fees = response.data;
      
      // Filter the fees to include only those with the specified grades "O/L" and "A/L"
      const relevantFees = fees.filter(fee => fee.grade === "O/L" || fee.grade === "A/L");
      
      // Find the fee for the specific grade and medium
      const feeEntry = relevantFees.find(fee => fee.medium === medium && fee.grade === grade);
      
      const fee = feeEntry ? feeEntry.fee : '';
      
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

  const validateSelections = () => {
    const errors = {};
    if (!formData.medium) {
      errors.medium = 'Medium is required.';
    }
    if (!formData.day) {
      errors.day = 'Day is required.';
    }
    if (!formData.exam) {
      errors.exam = 'Exam is required.';
    }
    if (!formData.examYear) {
      errors.examYear = 'Exam Year is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateSelections()) {
      return;
    }

    const subjectid = generateSubjectId();

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
    <div className="clssregister  ">
      <div>
        <h2 style={{textAlign:"center",marginBottom:50}}>New Class Registration</h2>
      </div>
      <div style={{widows:"80%",marginBottom:50}}>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="teacherId" >Teacher ID *</Form.Label>
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

          <Form.Group className="mb-3 medium-group">
          <Form.Label htmlFor="medium">Medium</Form.Label>
          <div className="radio-group">
            <div className="radio-button" style={{marginLeft:60}}>
              <input 
              type="radio" 
              id="mediumSinhala" 
              name="medium" 
              value="SINHALA" 
              checked={formData.medium === "SINHALA"} 
              onChange={handleChange} 
              />
              <label htmlFor="mediumSinhala">Sinhala</label>
              </div>
              <div className="radio-button">
                <input 
                type="radio" 
                id="mediumEnglish" 
                name="medium" 
                value="ENGLISH" 
                checked={formData.medium === "ENGLISH"} 
                onChange={handleChange} 
                />
                <label htmlFor="mediumEnglish">English</label>
                </div>
                </div>
                {validationErrors.medium && <div className="error" style={{color:"red"}}>{validationErrors.medium}</div>}
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
            {validationErrors.day && <div className="error" style={{color:"red"}}>{validationErrors.day}</div>}
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
            {validationErrors.exam && <div className="error" style={{color:"red"}}>{validationErrors.exam}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Exam Year *</Form.Label>
            <Form.Select id="examYear" aria-label="Exam Year" onChange={handleChange} value={formData.examYear} required>
              <option>Select the year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
            {validationErrors.examYear && <div className="error" style={{color:"red"}}>{validationErrors.examYear}</div>}
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

          <Button style={{width:"50%", height:"45px",marginTop:30,fontSize:18}} type="submit">Register</Button>
        </fieldset>
      </Form>
      </div>
    </div>
  );
}

export default ClassesForm;
