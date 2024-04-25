import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './form.css'
import { useState } from 'react';

function ClassesForm() {
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
          <Form.Label htmlFor="disabledTextInput">Teacher ID</Form.Label>
          <Form.Control id="disabledTextInput" placeholder="Enter Teacher ID" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="examYearInput">Exam Year</Form.Label>
          <Form.Control id="examYearInput"type="number"placeholder="Enter Exam Year"/>
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
          <Form.Label htmlFor="dobInput"> Registration Date</Form.Label>
          <Form.Control id="dobInput"type="date"/>
        </Form.Group>

        <Button type="submit">Register</Button>
      </fieldset>
    </Form>
  );
}

export default ClassesForm;