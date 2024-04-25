import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './form.css'
import { useState } from 'react';

function StudentForm() {
  const [workingOnOtherInstitute, setWorkingOnOtherInstitute] = useState(null);
  const [additionalFields, setAdditionalFields] = useState([]);

  const handleWorkingOnOtherInstituteChange = (event) => {
    setWorkingOnOtherInstitute(event.target.value);
    // Reset additional fields when changing the selection
    setAdditionalFields([]);
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, ""]);
  };

  const handleAdditionalFieldChange = (index, value) => {
    const newFields = [...additionalFields];
    newFields[index] = value;
    setAdditionalFields(newFields);
  };

  return (
    <Form>
      <fieldset>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Student Name</Form.Label>
          <Form.Control id="disabledTextInput" placeholder="Enter Student Name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Address</Form.Label>
          <Form.Control id="disabledTextInput" placeholder="Enter Student Address" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">School</Form.Label>
          <Form.Control id="disabledTextInput" placeholder="Enter School Name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="dobInput">Date of Birth</Form.Label>
          <Form.Control id="dobInput"type="date"/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Parents/ Legal Guardian Name</Form.Label>
          <Form.Control id="disabledTextInput" placeholder="Enter Name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Parents/ Legal Guardian Occupation</Form.Label>
          <Form.Control id="disabledTextInput" placeholder="Enter Occupation" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="emailInput">Email Address</Form.Label>
          <Form.Control id="emailInput"type="email"placeholder="Enter Email Address"/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="phoneNumberInput">Phone Number</Form.Label>
          <Form.Control id="phoneNumberInput" type="tel" placeholder="Enter Phone Number"/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Medium</Form.Label>
          <Form.Select aria-label="Default select example">
            <option>Select the medium</option>
            <option value="sinhala">Sinhala</option>
            <option value="english">English</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Select Grade</Form.Label>
          <Form.Select aria-label="Default select example">
            <option>Select the Grade</option>
            <option value="6">Grade 06</option>
            <option value="6">Grade 07</option>
            <option value="6">Grade 08</option>
            <option value="6">Grade 09</option>
            <option value="6">Grade 10</option>
            <option value="6">Grade 11</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Select Subjects</Form.Label>
          <div className="checkbox-container">
            <Form.Check type="checkbox" label="Maths" />
            <Form.Check type="checkbox" label="Science" />
            <Form.Check type="checkbox" label="English" />
            <Form.Check type="checkbox" label="History" />
            <Form.Check type="checkbox" label="Sinhala" />
            <Form.Check type="checkbox" label="ICT" />
            <Form.Check type="checkbox" label="English Lit." />
            <Form.Check type="checkbox" label="Commerce" />
            <Form.Check type="checkbox" label="Tamil" />
            <Form.Check type="checkbox" label="Art" />
            <Form.Check type="checkbox" label="Health & Physical Edu." />
            <Form.Check type="checkbox" label="Geography" />
            <Button onClick={handleAddField}>Other...</Button>
            </div>
              {additionalFields.map((field, index) => (
                <div key={index}>
                  <Form.Control
                    type="text"
                    placeholder={`Other Subject   ${index + 1}`}
                    value={field}
                    onChange={(e) => handleAdditionalFieldChange(index, e.target.value)}
                  />
                </div>
              ))}
            

        </Form.Group>



        

        <Form.Group className="mb-3">
          <Form.Label htmlFor="dobInput">Registration Date</Form.Label>
          <Form.Control id="dobInput"type="date"/>
        </Form.Group>

        <Button type="submit">Register</Button>
      </fieldset>
    </Form>
  );
}

export default StudentForm;