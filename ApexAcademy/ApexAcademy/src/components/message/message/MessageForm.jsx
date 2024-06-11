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


        <br/>

        <div> 
           
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

        <br/>
        <Button type="submit">Send Message</Button>
      </fieldset>
    </Form>
  );
}

export default MessageForm;