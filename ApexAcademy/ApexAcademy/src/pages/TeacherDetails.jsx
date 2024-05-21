import user_icon from "../assets/person.png";
import password_icon from "../assets/password.png";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import axios from 'axios';
import Swal from 'sweetalert2';

function Login() {
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');

  const isEmpty = (value) => value.trim() === '';

  let navigate = useNavigate(); 

  const handleLogin = async (e) => {
    if (isEmpty(userId) || isEmpty(password)) {
      Swal.fire({
        title: 'Fields Missing',
        text: 'Please fill all the fields',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8085/api/v1/staff/login', { userId, password });
      if (response.status === 200 && response.data.message === "Login Success") {
        let path = `dashboard`; 
        localStorage.setItem('isAuthenticated', true);
        navigate(path);
      } else {
        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid user ID or password',
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

  return (
    <>
      <div className="logingBack">
        <div className="logandreg">
          <img 
            alt="HeroImg" 
            src="https://thamesgroupuk.com/wp-content/uploads/2019/04/heroimagegraphic.png"
            className="heroimg"
          />
          <div className="Logincontainer">
            <div className="Signheader">
              <div className="Signtext">Login</div>
              <div className="Signunderline"></div>

              <div className="Signinputs">
                <div className="Signinput">
                  <img src={user_icon} alt="User Icon" />
                  <input 
                    type="text" 
                    placeholder="Enter Staff ID" 
                    value={userId} 
                    onChange={e => setUserId(e.target.value)} 
                  />
                </div>

                <div className="Signinput">
                  <img src={password_icon} alt="Password Icon" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="Signsubmit-container">
                <button 
                  className="Signsubmit" 
                  onClick={handleLogin} 
                  style={{ width: '500px' }} 
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
