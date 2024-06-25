import { Button, Form, FormControl, FormLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './form.css';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate} from "react-router-dom";
import emailjs from '@emailjs/browser';


function TeachersForm() {
  const initialFormData = {
    teacherid: 'TCH',
    teachername: '',
    gender:'',
    address: '',
    subject: '',
    email: '',
    phoneNumbers: [''],
    dob: '',
    grade: [''],
    workingPlaces: [],
    medium: '',
    registrationdate: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Colombo', hour12: false }).slice(0, 16),
  };

  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  const handleAddField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const handleDeleteField = (field, index) => {
    const updatedFields = formData[field].filter((_, idx) => idx !== index);
    setFormData({
      ...formData,
      [field]: updatedFields,
    });
  };

  const handleFieldChange = (field, index, value) => {
    const updatedFields = [...formData[field]];
    updatedFields[index] = value;
    setFormData({
      ...formData,
      [field]: updatedFields,
    });
  };

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setFormData({
      ...formData,
      [name || id]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedGrades = [...formData.grade];
    if (checked) {
      updatedGrades.push(value);
    } else {
      updatedGrades = updatedGrades.filter((grade) => grade !== value);
    }
    setFormData({
      ...formData,
      grade: updatedGrades,
    });
  };

  

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^0\d{9}$/; // 10 digit number starting with 0
    return phoneNumberRegex.test(phoneNumber);
  };
  
  

  const validateSelections = () => {
    const errors = {};
    if (!formData.gender) {
      errors.gender = 'Gender is required.';
    }
    if (!formData.medium) {
      errors.medium = 'Medium is required.';
    }
    if (!formData.grade.length) {
      errors.grade = 'At least one grade must be selected.';
    }
    formData.phoneNumbers.forEach((phone, index) => {
      if (!validatePhoneNumber(phone)) {
        errors[`phoneNumber${index}`] = 'Enter valid Phone Number.';
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendApprovalEmail = async ({email,teacherid,teachername}) => {
    try {
      await emailjs.send(
        'service_oooguqt',
        'template_a96rsdb',
        { email,
          teacherid,
          teachername
         },
      
         {publicKey: '33tz_Atm_cauQqQil',}
         
      );
      console.log("heremail");
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire(
        'Error!',
        'There was an error sending the approval email.',
        'error'
      );
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateSelections()) {
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        password: formData.email,
      };

      const response = await axios.post('http://localhost:8085/api/v1/teacher/add', dataToSend);
      await sendApprovalEmail({
        email: formData.email,
        teacherid: response.data.teacherid,
        teachername: formData.teachername});

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Teacher has been registered successfully.',
      });
      navigate(`/teachers/${response.data.teacherid}`);

      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Failed to register teacher. Please try again later.',
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="clssregister " >
    <div>
      <h2 style={{textAlign:"center",marginBottom:50}}>New Teachers Registration</h2>
    </div>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="teachername">Teacher Name *</Form.Label>
            <Form.Control
              id="teachername"
              placeholder="Enter Teacher Name"
              onChange={handleChange}
              value={formData.teachername}
              required
            />
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
                {validationErrors.gender && <div className="error" style={{color:"red"}}>{validationErrors.gender}</div>}
                </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label htmlFor="subject">Subject *</Form.Label>
            <Form.Control
              id="subject"
              placeholder="Enter Subject"
              onChange={handleChange}
              value={formData.subject}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email Address *</Form.Label>
            <Form.Control
              id="email"
              type="email"
              placeholder="Enter Email Address"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </Form.Group>

          <div style={{width:"50%"}}>
          {formData.phoneNumbers.map((phone, index) => (
            <Form.Group className="mb-3" key={index}>
              <Form.Label htmlFor={`phoneNumber${index}`}>Phone Number {index + 1} *</Form.Label>
              <div className="d-flex">
                <Form.Control
                  id={`phoneNumber${index}`}
                  type="tel"
                  placeholder="Enter Phone Number"
                  value={phone}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}  maxLength="10"
                  onChange={(e) => handleFieldChange('phoneNumbers', index, e.target.value)}
                  required
                />
                {index > 0 && (
                  <Button variant="danger" onClick={() => handleDeleteField('phoneNumbers', index)}>
                    Delete
                  </Button>
                )}
              </div>
              {validationErrors[`phoneNumber${index}`] && (
                  <div className="error" style={{ color: 'red' }}>{validationErrors[`phoneNumber${index}`]}</div>
                )}
            </Form.Group>
          ))}
          <Button onClick={() => handleAddField('phoneNumbers')}>Add Phone Number</Button>
          </div>

          <div>
          {formData.workingPlaces.map((place, index) => (
            <Form.Group className="mb-3" key={index}>
              <Form.Label htmlFor={`workingPlace${index}`}>Working Place {index + 1}</Form.Label>
              <div className="d-flex" style={{width:"450px"}}>
                <Form.Control
                  id={`workingPlace${index}`}
                  placeholder="Enter Working Place"
                  value={place}
                  onChange={(e) => handleFieldChange('workingPlaces', index, e.target.value)}
                />
                {index >= 0 && (
                  <Button style={{marginLeft:10}} variant="danger" onClick={() => handleDeleteField('workingPlaces', index)}>
                    Delete
                  </Button>
                )}
              </div>
            </Form.Group>
          ))}
          <Button  style={{ marginTop: formData.workingPlaces.length > 0 ? 0 : 35 }} onClick={() => handleAddField('workingPlaces')}>Add Working Place</Button>
          </div>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="address">Address *</Form.Label>
            <Form.Control
              id="address"
              placeholder="Enter Address"
              onChange={handleChange}
              value={formData.address}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="dob">Date of Birth</Form.Label>
            <Form.Control id="dob" type="date" onChange={handleChange} value={formData.dob} required/>
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
            <Form.Label>Grade *</Form.Label>
            <div className="checkbox-container" >
              <Form.Check
                type="checkbox"
                label="O/L"
                value="O/L"
                checked={formData.grade.includes('O/L')}
                onChange={handleCheckboxChange}
                
              />
              <Form.Check
                type="checkbox"
                label="A/L"
                value="A/L"
                checked={formData.grade.includes('A/L')}
                onChange={handleCheckboxChange}
              />
             
            </div>
            {validationErrors.grade && <div className="error" style={{ color: "red" }}>{validationErrors.grade}</div>}
          </Form.Group>

          

          <Form.Group className="mb-3">
            <Form.Label htmlFor="registrationdate">Registration Date</Form.Label>
            <Form.Control id="registrationdate" type="datetime-local" value={formData.registrationdate} readOnly />
          </Form.Group>

          <Button className='studentbtn' style={{fontWeight:"bold",fontSize:15,marginTop:25}} type="submit">Register</Button>
         
        </fieldset>
      </Form>
    </div>
  );
}

export default TeachersForm;
