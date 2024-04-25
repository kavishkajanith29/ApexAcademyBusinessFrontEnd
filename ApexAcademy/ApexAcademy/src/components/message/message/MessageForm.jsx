import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from "react"; 

function MessageForm() {
  const [selected, setSelected] = React.useState(""); 
  
  const changeSelectOptionHandler = (event) => { 
    setSelected(event.target.value); 
  }; 
  

  const Student = [ 
    "kasunkumara@gmail.com", 
    "kakumara@gmail.com", 
    "kasunara@gmail.com", 
  ]; 
  const Teacher = ["kasunkumara11@gmail.com", 
  "kakumara22@gmail.com", 
  "kasunara33@gmail.com"];

  const All = ["kasunkumara@gmail.com", 
    "kakumara@gmail.com", 
    "kasunara@gmail.com"]; 
  
  
  let type = null; 
  

  let options = null; 
  

  if (selected === "Student") { 
    type = Student; 
  } else if (selected === "Teacher") { 
    type = Teacher 
  } else if (selected === "All") { 
    type = All; 
  } 
  
  
  if (type) { 
    options = type.map((el) => <option key={el}>{el}</option>); 
  }
  return (
    <Form>
      <fieldset>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="disabledTextInput">Enter Message</Form.Label>
          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </Form.Group>
        {/* <Form.Group className="mb-3">
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
        </Form.Group> */}

        {/* <div class="form-group">
           <label for="exampleInputEmail1">Email address</label>
           <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
           <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div> */}

        <br/>

        <div> 
          {/** Bind changeSelectOptionHandler to onChange method of select. 
           * This method will trigger every time different 
           * option is selected. 
           */} 
           
           <label for="exampleInputEmail1">Select</label> <br/>
            <select onChange={changeSelectOptionHandler}> 
            <option>Select the Message Category</option> 
            <option>Student</option> 
            <option>Teacher</option> 
            <option>All</option> 
          </select> 
         
        </div> 
        <br/>
        <label for="exampleInputEmail1">Select Email</label> <br/>
        <div> 
          <select> 
            { 
              /** This is where we have used our options variable */
              options 
            } 
          </select> 
        </div> 
        
        <br/>
        <div class="form-group">
           <label for="exampleInputEmail1">Email address</label>
           <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
           <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        {/* <div data-mdb-input-init class="form-outline">
        <label class="form-label" for="typeNumber">Do You Want to Send Message for the Institiute</label>
        
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="disabledFieldsetCheck"
            label="Yes"
          />
        </Form.Group>
        </div> */}
        <br/>
        <Button type="submit">Send Message</Button>
      </fieldset>
    </Form>
  );
}

export default MessageForm;