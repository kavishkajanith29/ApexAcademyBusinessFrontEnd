import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

function MessageForm() {
  return (
    <Form>
      <fieldset>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Enter Message</Form.Label>
          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledSelect">Select Grade</Form.Label>
          <Form.Select aria-label="Default select example">
              <option>None</option>
              <option>All Grade</option>
              <option value="1">Grade 06 - English</option>
              <option value="2">Grade 07 - English</option>
              <option value="3">Grade 08 - English</option>
              <option value="4">Grade 09 - English</option>
              <option value="5">Grade 10 - English</option>
              <option value="6">Grade 11 - English</option>
          </Form.Select>
        </Form.Group>

        <div class="form-group">
           <label for="exampleInputEmail1">Email address</label>
           <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
           <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        <br/>

        <div data-mdb-input-init class="form-outline">
        <label class="form-label" for="typeNumber">Do You Want to Send Message for the Institiute</label>
        
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="disabledFieldsetCheck"
            label="Yes"
          />
        </Form.Group>
        </div>
        <br/>
        <Button type="submit">Send Message</Button>
      </fieldset>
    </Form>
  );
}

export default MessageForm;