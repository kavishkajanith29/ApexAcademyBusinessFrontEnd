import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './form.css'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function StudentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentname: '',
    gender:'',
    address: '',
    school: '',
    dob: '',
    parentsname: '',
    parentsoccupation: '',
    email: '',
    phonenumber: '',
    medium: '',
    grade: '',
    registrationdate: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Colombo", hour12: false }).slice(0, 16),
  });
  const [gradeOptions, setGradeOptions] = useState([]);
  const currentYear = new Date().getFullYear();
  const [validationErrors, setValidationErrors] = useState({});

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^0\d{9}$/; // 10 digit number starting with 0
    return phoneNumberRegex.test(phoneNumber);
  };
  
  

  const validateSelections = () => {
    const errors = {};
    if (!formData.exam) {
      errors.exam = 'Exam is required.';
    }
    if (!formData.examYear) {
      errors.examYear = 'Exam Year is required.';
    }
    if (!formData.grade) {
      errors.grade = 'Grade is required.';
    }
    if (!formData.medium) {
      errors.medium = 'Medium is required.';
    }
    if (!validatePhoneNumber(formData.phonenumber)) {
      errors.phonenumber = 'Enter valid Phone Number.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setFormData({
      ...formData,
      [name || id]: value
    });
  
    if (id === "exam") {
      if (value === "OL") {
        setGradeOptions(['Grade 06', 'Grade 07', 'Grade 08', 'Grade 09', 'Grade 10', 'Grade 11']);
      } else if (value === "AL") {
        setGradeOptions(['Grade 12', 'Grade 13']);
      }
    }
  };

  const generateExamYearOptions = () => {
    const options = [];
    for (let i = 0; i < 7; i++) {
      const year = currentYear + i;
      options.push(<option key={year} value={year}>{year}</option>);
    }
    return options;
  };

  const getExamYearLabel = () => {
    if (formData.exam === "OL") {
      return "Exam Year of OL";
    } else if (formData.exam === "AL") {
      return "Exam Year of AL";
    }
    return "Exam Year";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateSelections()) {
      return;
    }

    const studentid = `${formData.exam}${formData.examYear}`;

    try {
      const dataToSend = {
        studentid: studentid,
        studentname: formData.studentname,
        gender:formData.gender,
        address: formData.address,
        school: formData.school,
        dob: formData.dob,
        parentsname: formData.parentsname,
        parentsoccupation: formData.parentsoccupation,
        email: formData.email,
        phonenumber: formData.phonenumber,
        medium: formData.medium,
        grade: formData.grade,
        registrationdate: formData.registrationdate,
        password: formData.email
      };

      const response = await axios.post('http://localhost:8085/api/v1/student/add', dataToSend);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        confirmButtonColor: '#48BB78',
      });

      navigate(`/student/${response.data.studentid}`);
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      studentname: '',
      address: '',
      school: '',
      dob: '',
      parentsname: '',
      parentsoccupation: '',
      email: '',
      phonenumber: '',
      medium: '',
      exam: '',
      grade: '',
      registrationdate: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Colombo", hour12: false }).slice(0, 16),
      examYear: '',
    });
    setGradeOptions([]);
  };
  return (
    <div className="clssregister " >
      <div>
        <h2 style={{textAlign:"center",marginBottom:50}}>New Students Registration</h2>
      </div>
      <div style={{widows:"80%",marginBottom:50}}>
      <Form onSubmit={handleSubmit}>
      <fieldset>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="studentname">Student Name</Form.Label>
          <Form.Control id="studentname" placeholder="Enter Student Name" onChange={handleChange} value={formData.studentname} required/>
        </Form.Group>

        <Form.Group className="mb-3 medium-group">
          <Form.Label htmlFor="medium">Gender</Form.Label>
          <div className="radio-group" style={{marginLeft:60}}>
            <div className="radio-button">
              <input 
              type="radio" 
              id="genderMale" 
              name="gender" 
              value="Male" 
              checked={formData.gender === "Male"} 
              onChange={handleChange} 
              />
              <label htmlFor="genderMale">Male</label>
              </div>
              <div className="radio-button">
                <input 
                type="radio" 
                id="genderFemale" 
                name="gender" 
                value="Female" 
                checked={formData.gender === "Female"} 
                onChange={handleChange} 
                />
                <label htmlFor="genderFemale">Female</label>
                </div>
                </div>
                {validationErrors.medium && <div className="error" style={{color:"red"}}>{validationErrors.medium}</div>}
                </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="address">Address</Form.Label>
          <Form.Control id="address" placeholder="Enter Student Address" onChange={handleChange} value={formData.address} required/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="school">School</Form.Label>
          <Form.Control id="school" placeholder="Enter School Name" onChange={handleChange} value={formData.school} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="dob">Date of Birth</Form.Label>
          <Form.Control id="dob"type="date" onChange={handleChange} value={formData.dob} required/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="parentsname">Parents/ Legal Guardian Name</Form.Label>
          <Form.Control id="parentsname" placeholder="Enter Name" onChange={handleChange} value={formData.parentsname} required/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="parentsoccupation">Parents/ Legal Guardian Occupation</Form.Label>
          <Form.Control id="parentsoccupation" placeholder="Enter Occupation" onChange={handleChange} value={formData.parentsoccupation} required/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email Address</Form.Label>
          <Form.Control id="email"type="email"placeholder="Enter Email Address" onChange={handleChange} value={formData.email} required/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="phonenumber">Phone Number</Form.Label>
          <Form.Control id="phonenumber" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}  maxlength="10" type="tel" placeholder="Enter Phone Number" onChange={handleChange} value={formData.phonenumber} required/>
          {validationErrors.phonenumber && (<div className="error" style={{ color: 'red' }}>{validationErrors.phonenumber}</div>)}
        </Form.Group>

        <Form.Group className="mb-3 medium-group">
          <Form.Label htmlFor="medium">Medium</Form.Label>
          <div className="radio-group">
            <div className="radio-button" style={{marginLeft:60}}>
              <input 
              type="radio" 
              id="mediumSinhala" 
              name="medium" 
              value="Sinhala" 
              checked={formData.medium === "Sinhala"} 
              onChange={handleChange} 
              />
              <label htmlFor="mediumSinhala">Sinhala</label>
              </div>
              <div className="radio-button">
                <input 
                type="radio" 
                id="mediumEnglish" 
                name="medium" 
                value="English" 
                checked={formData.medium === "English"} 
                onChange={handleChange} 
                />
                <label htmlFor="mediumEnglish">English</label>
                </div>
                </div>
                {validationErrors.medium && <div className="error" style={{color:"red"}}>{validationErrors.medium}</div>}
                </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="exam">Exam</Form.Label>
            <Form.Select id="exam" aria-label="exam" onChange={handleChange} value={formData.exam} required>
              <option>Select the Exam</option>
              <option value="OL">O/L</option>
              <option value="AL">A/L</option>
            </Form.Select>
            {validationErrors.exam && <div className="error" style={{color:"red"}}>{validationErrors.exam}</div>}
          </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="examYear">{getExamYearLabel()}</Form.Label>
              <Form.Select id="examYear" aria-label="examYear" onChange={handleChange} value={formData.examYear} required>
                {generateExamYearOptions()}
              </Form.Select>
              {validationErrors.examYear && <div className="error" style={{color:"red"}}>{validationErrors.examYear}</div>}
            </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="grade">Select Grade</Form.Label>
            <Form.Select id="grade" aria-label="grade" onChange={handleChange} value={formData.grade} required>
              <option>Select the Grade</option>
              {gradeOptions.map((grade, index) => (
                <option key={index} value={grade}>{grade}</option>
              ))}
            </Form.Select>
            {validationErrors.grade && <div className="error" style={{color:"red"}}>{validationErrors.grade}</div>}
          </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="registrationdate">Registration Date</Form.Label>
            <Form.Control id="registrationdate" type="datetime-local" value={formData.registrationdate} readOnly />
          </Form.Group>

        <Button className='studentbtn' style={{fontWeight:"bold",fontSize:15}}  type="submit">Register</Button>
      </fieldset>
    </Form>
      </div>
    </div>
  );
}

export default StudentForm;