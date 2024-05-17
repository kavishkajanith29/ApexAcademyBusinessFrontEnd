import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Img1 from '../assets/images/img1.jpg'
import './LoginPage.css'
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';


function Login() {

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  let navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8085/api/v1/staff/login', formData);
      if(response.data.message === "Login Success"){
        let path = `dashboard`; 
        localStorage.setItem('isAuthenticated', true);
        navigate(path);
      }
    } catch (error) {
      console.error('Error submitting loggin', error);
    }
  }
  

  return (
    <div className="container">
      <div className='maincontainerlogin'>
        <img src={Img1} alt='Image' className='loginImage'/>
      </div>
      <div className='secondcontainer'>
        <div className='nameofacadamy'>APEX Business Acadamy <br/> (pvt) LTD</div>
        <div className='nameofwelcome'>This is a APEX Business Acadamy Offical Website. All of Student,Teachers can used this site</div>
        <div className="formdiv">
        <Form onSubmit={handleLogin}>
          <fieldset>
            <Form.Group className="mb-3">
              <Form.Control id="userId" type="text" placeholder="Enter Staff ID" onChange={handleChange} value={formData.userId}/>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Control id="password" type="password" placeholder="Enter Password" onChange={handleChange} value={formData.password}/>
                </Form.Group>
                
                <Button type="submit">Login</Button>
                
                </fieldset>
                </Form>
                </div>
      </div>
    </div>
  );
}

export default Login
