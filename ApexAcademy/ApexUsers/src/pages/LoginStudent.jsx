import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginStudent.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Img1 from '../assets/images/img1.jpg';
import user_icon from "../assets/person.png";
import password_icon from "../assets/password.png";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'; // Import visibility icons

function LoginStudent() {
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isEmpty = (value) => value.trim() === '';

  let navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isEmpty(userId) || isEmpty(password)) {
      Swal.fire({
        title: 'Fields Missing',
        text: 'Please Enter User ID and Password',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8085/api/v1/student/login', { userId, password });
      if (response.status === 200 && response.data.message === "Login Success") {
        let path = `dashboard`; 
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('studentId', userId); // Save studentId
        navigate(path);
      } else {
        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid Student ID or password Student ID not Approved',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error submitting login', error);
      Swal.fire({
        title: 'Login Failed',
        text: 'An error occurred during login. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

  const handleRegister = () =>{ 
    let path = `/LoginPage/student/register`; 
    navigate(path);
  }

  return (
    <>
      <div className="logingBack">
        <div className="logandreg">
          <div className='maincontainerlogin'>
            <img src={Img1} alt='Image' className='loginImage' />
          </div>
          <div className="Logincontainer">
            <div className="Signheader">
              <div className="Signtext">Student Login</div>
              <div className="Signunderline"></div>
              <div className="Signinputs">
                <div className="Signinput">
                  <img src={user_icon} alt="User Icon" />
                  <input 
                    type="text" 
                    placeholder="Enter Student ID" 
                    value={userId} 
                    onChange={e => setUserId(e.target.value)} 
                  />
                </div>

                <div className="Signinput">
                  <img src={password_icon} alt="Password Icon" />
                  <input 
                    type={passwordVisible ? "text" : "password"} 
                    placeholder="Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  {passwordVisible ? (
                    <MdVisibilityOff
                      onClick={togglePasswordVisibility}
                      className="password-toggle-icon-student"
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <MdVisibility
                      onClick={togglePasswordVisibility}
                      className="password-toggle-icon-student"
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </div>
              </div>

              <div className="Signsubmit-container-student">
                <button 
                  className="Signsubmit" 
                  onClick={handleLogin} 
                  style={{ width: '500px' }} 
                >
                  Login
                </button>
              </div>

              <div className="Registersubmit-container-student">
                <button 
                  className ='Registersubmit' 
                  onClick={handleRegister}
                  style={{ width: '500px' }} 
                >
                Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginStudent;
