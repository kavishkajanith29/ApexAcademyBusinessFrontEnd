import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './form.css'
import { useState } from 'react';

function TeachersForm() {
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
          <Form.Label htmlFor="disabledTextInput">Name</Form.Label>
          <Form.Control id="disabledTextInput" placeholder="Enter Name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Address</Form.Label>
          <Form.Control id="disabledTextInput" placeholder="Enter Address" />
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
          <Form.Label htmlFor="dobInput">Date of Birth</Form.Label>
          <Form.Control id="dobInput"type="date"/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Select Grade</Form.Label>
          <div className="checkbox-container">
            <Form.Check type="checkbox" label="Grade 06" value="6"/>
            <Form.Check type="checkbox" label="Grade 07" value="7"/>
            <Form.Check type="checkbox" label="Grade 08" value="8"/>
            <Form.Check type="checkbox" label="Grade 09" value="9"/>
            <Form.Check type="checkbox" label="Grade 10" value="10"/>
            <Form.Check type="checkbox" label="Grade 11" value="11"/>
            </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Currently working on other Institute</Form.Label>
          <Form.Select aria-label="Default select example" onChange={handleWorkingOnOtherInstituteChange}>
            <option>Select the Yes/No</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Select>
        </Form.Group>

        {workingOnOtherInstitute === "Yes" && (
          <div>
            <Form.Group className="mb-3">
              {additionalFields.map((field, index) => (
                <div key={index}>
                  <Form.Control
                    type="text"
                    placeholder={`Institute  ${index + 1}`}
                    value={field}
                    onChange={(e) => handleAdditionalFieldChange(index, e.target.value)}
                  />
                </div>
              ))}
              <Button onClick={handleAddField}>Add Institute</Button>
            </Form.Group>
          </div>
        )}


        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Medium</Form.Label>
          <Form.Select aria-label="Default select example">
            <option>Select the medium</option>
            <option value="sinhala">Sinhala</option>
            <option value="english">English</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="dobInput">Institute Registration Date</Form.Label>
          <Form.Control id="dobInput"type="date"/>
        </Form.Group>

        <Button type="submit">Register</Button>
      </fieldset>
    </Form>
  );
}

export default TeachersForm;