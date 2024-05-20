import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './form.css'
import { useState } from 'react';

function StudentForm() {
  const [additionalFields, setAdditionalFields] = useState([]);
  const [formData, setFormData] = useState({
    studentname: '',
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
    paymentReceipt: null,
  });
  const [gradeOptions, setGradeOptions] = useState([]);
  const currentYear = new Date().getFullYear();

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, ""]);
  };

  const handleAdditionalFieldChange = (index, value) => {
    const newFields = [...additionalFields];
    newFields[index] = value;
    setAdditionalFields(newFields);
  };

 

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
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

    const studentid = `${formData.exam}${formData.examYear}`;

    try {
      const dataToSend = {
        studentid: studentid,
        studentname: formData.studentname,
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
      console.log(response.data);
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
    <div className="clssregister">
      <Form onSubmit={handleSubmit}>
      <fieldset>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="studentname">Student Name</Form.Label>
          <Form.Control id="studentname" placeholder="Enter Student Name" onChange={handleChange} value={formData.studentname}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="address">Address</Form.Label>
          <Form.Control id="address" placeholder="Enter Student Address" onChange={handleChange} value={formData.address}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="school">School</Form.Label>
          <Form.Control id="school" placeholder="Enter School Name" onChange={handleChange} value={formData.school}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="dob">Date of Birth</Form.Label>
          <Form.Control id="dob"type="date" onChange={handleChange} value={formData.dob}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="parentsname">Parents/ Legal Guardian Name</Form.Label>
          <Form.Control id="parentsname" placeholder="Enter Name" onChange={handleChange} value={formData.parentsname}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="parentsoccupation">Parents/ Legal Guardian Occupation</Form.Label>
          <Form.Control id="parentsoccupation" placeholder="Enter Occupation" onChange={handleChange} value={formData.parentsoccupation}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email Address</Form.Label>
          <Form.Control id="email"type="email"placeholder="Enter Email Address" onChange={handleChange} value={formData.email} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="phonenumber">Phone Number</Form.Label>
          <Form.Control id="phonenumber" type="tel" placeholder="Enter Phone Number" onChange={handleChange} value={formData.phonenumber}/>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="medium">Medium</Form.Label>
            <Form.Select id="medium" aria-label="Medium" onChange={handleChange} value={formData.medium}>
              <option>Select the medium</option>
              <option value="Sinhala">Sinhala</option>
              <option value="English">English</option>
            </Form.Select>
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label htmlFor="exam">Exam</Form.Label>
            <Form.Select id="exam" aria-label="exam" onChange={handleChange} value={formData.exam}>
              <option>Select the Exam</option>
              <option value="OL">O/L</option>
              <option value="AL">A/L</option>
            </Form.Select>
          </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="examYear">{getExamYearLabel()}</Form.Label>
              <Form.Select id="examYear" aria-label="examYear" onChange={handleChange} value={formData.examYear}>
                {generateExamYearOptions()}
              </Form.Select>
            </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="grade">Select Grade</Form.Label>
            <Form.Select id="grade" aria-label="grade" onChange={handleChange} value={formData.grade}>
              <option>Select the Grade</option>
              {gradeOptions.map((grade, index) => (
                <option key={index} value={grade}>{grade}</option>
              ))}
            </Form.Select>
          </Form.Group>

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

export default StudentForm;