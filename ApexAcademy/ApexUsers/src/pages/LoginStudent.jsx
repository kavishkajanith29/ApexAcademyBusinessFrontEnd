import React,{ useState } from 'react'
import { useNavigate } from "react-router-dom";
import Img1 from '../assets/images/img1.jpg'
import './LoginPageHome.css'
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

import { MdAccountCircle } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";


const LoginStudent = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

let navigate = useNavigate(); 

  const handleLogin = () =>{ 
    let path = `/student/dashboard`; 
    navigate(path);
  }

  const handleRegister = () =>{ 
    let path = `/LoginPage/student/register`; 
    navigate(path);
  }

  

  return (
    <div className="container">
      <div className='maincontainerlogin'>
        <img src={Img1} alt='Image' className='loginImage'/>
      </div>
      <div className='secondcontainer'>
        <div className='nameofacadamy'>APEX Business Acadamy <br/> (pvt) LTD</div>
        <div className='nameofwelcome'>This is a APEX Business Acadamy Offical Website. All of Student,Teachers can used this site</div>
      
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <FormControl variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">
          User ID
        </InputLabel>
        <Input
          id="input-with-icon-adornment"
          value={userId}
              onChange={(e) => setUserId(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <MdAccountCircle />
            </InputAdornment>
          }
        />
      </FormControl>
      <br/>
      <FormControl variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">
          User Password
        </InputLabel>
        <Input
          id="input-with-icon-adornment"
          value={password}
              onChange={(e) => setPassword(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <RiLockPasswordLine />
            </InputAdornment>
          }
        />
      </FormControl>
   
    </Box>
    <br/>

      
      <button className ='btn_log' onClick={handleLogin}>
        LogIn
      </button>
      
      <button className ='btn_log' onClick={handleRegister}>
        Register
      </button>
 
      </div>
    </div>
  )
}

export default LoginStudent
