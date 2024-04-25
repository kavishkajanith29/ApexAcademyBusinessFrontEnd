import React from 'react'
import { useNavigate } from "react-router-dom";
import Img1 from '../assets/images/img1.jpg'
import './LoginPageHome.css'

const LoginPageHome = () => {

let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `LoginPage`; 
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
      <button onClick={routeChange} className='btnLogin'>
        Log In
      </button>
      </div>
    </div>
  )
}

export default LoginPageHome
