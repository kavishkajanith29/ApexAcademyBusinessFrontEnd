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
    address: '',
    subject: '',
    email: '',
    phoneNumbers: [''],
    dob: '',
    grade: [],
    workingPlaces: [],
    medium: '',
    registrationdate: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Colombo', hour12: false }).slice(0, 16),
  };

  const navigate = useNavigate();

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
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
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
    if (!validateForm()) {
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        password: formData.email,
      };

      const response = await axios.post('http://localhost:8085/api/v1/teacher/add', dataToSend);
      //console.log(response.data)
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
      navigate(`/teachers`);

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

  const validateForm = () => {
    if (
      formData.teachername &&
      formData.address &&
      formData.subject &&
      formData.email &&
      formData.phoneNumbers.length > 0
    ) {
      return true;
    } else {
      // Show validation error message
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields and provide at least one phone number.',
      });
      return false;
    }
  };

  return (
    <div className="teacherregister">
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

          {formData.phoneNumbers.map((phone, index) => (
            <Form.Group className="mb-3" key={index}>
              <Form.Label htmlFor={`phoneNumber${index}`}>Phone Number {index + 1} *</Form.Label>
              <div className="d-flex">
                <Form.Control
                  id={`phoneNumber${index}`}
                  type="tel"
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={(e) => handleFieldChange('phoneNumbers', index, e.target.value)}
                  required
                />
                {index > 0 && (
                  <Button variant="danger" onClick={() => handleDeleteField('phoneNumbers', index)}>
                    Delete
                  </Button>
                )}
              </div>
            </Form.Group>
          ))}
          <Button onClick={() => handleAddField('phoneNumbers')}>Add Phone Number</Button>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="dob">Date of Birth</Form.Label>
            <Form.Control id="dob" type="date" onChange={handleChange} value={formData.dob} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="medium">Medium *</Form.Label>
            <Form.Select id="medium" aria-label="Medium" onChange={handleChange} value={formData.medium} required>
              <option>Select the medium</option>
              <option value="Sinhala">Sinhala</option>
              <option value="English">English</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Grade *</Form.Label>
            <div className="checkbox-container">
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
          </Form.Group>

          {formData.workingPlaces.map((place, index) => (
            <Form.Group className="mb-3" key={index}>
              <Form.Label htmlFor={`workingPlace${index}`}>Working Place {index + 1}</Form.Label>
              <div className="d-flex">
                <Form.Control
                  id={`workingPlace${index}`}
                  placeholder="Enter Working Place"
                  value={place}
                  onChange={(e) => handleFieldChange('workingPlaces', index, e.target.value)}
                />
                {index > 0 && (
                  <Button variant="danger" onClick={() => handleDeleteField('workingPlaces', index)}>
                    Delete
                  </Button>
                )}
              </div>
            </Form.Group>
          ))}
          <Button onClick={() => handleAddField('workingPlaces')}>Add Working Place</Button>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="registrationdate">Registration Date</Form.Label>
            <Form.Control id="registrationdate" type="datetime-local" value={formData.registrationdate} readOnly />
          </Form.Group>

          <Button type="submit">Register</Button>
        </fieldset>
      </Form>
    </div>
  );
}

export default TeachersForm;
