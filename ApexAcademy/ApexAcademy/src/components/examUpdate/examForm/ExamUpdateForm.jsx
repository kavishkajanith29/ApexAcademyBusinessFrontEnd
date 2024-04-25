import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

function ExamUpdateForm() {
  return (
    <Form>
      <fieldset>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Student ID</Form.Label>
          <Form.Control id="disabledTextInput" placeholder="Enter Student ID" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Select Grade</Form.Label>
          <Form.Select aria-label="Default select example">
              <option>Select the Grade</option>
              <option value="1">Grade 06 - English</option>
              <option value="2">Grade 07 - English</option>
              <option value="3">Grade 08 - English</option>
              <option value="4">Grade 09 - English</option>
              <option value="5">Grade 10 - English</option>
              <option value="6">Grade 11 - English</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Select Exam</Form.Label>
          <Form.Select aria-label="Default select example">
              <option>Select the Exam</option>
              <option value="1">January Exam</option>
              <option value="2">February Exam</option>
              <option value="3">March Exam</option>
              
          </Form.Select>
        </Form.Group>

        <div data-mdb-input-init class="form-outline">
        <label class="form-label" for="typeNumber">Student Marks</label>
        <input type="number" id="typeNumber" class="form-control" placeholder="Enter Student Marks"/>
          
        </div>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="disabledFieldsetCheck"
            label="Can't check this"
          />
        </Form.Group>
        <br/>
        <Button type="submit">Submit</Button>
      </fieldset>
    </Form>
  );
}

export default ExamUpdateForm;