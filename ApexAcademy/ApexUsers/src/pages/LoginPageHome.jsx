import React from 'react'
import { useNavigate } from "react-router-dom";

import './LoginPageHome.css'
import Side from '../assets/apex.jpg'

const LoginPageHome = () => {

let navigate = useNavigate(); 

  const routeChange = () =>{ 
    let path = `LoginPage`; 
    navigate(path);
  }

  // const handleClick = () => {
  //   document.querySelector('.overlay').classList.add('slide-up');
  //   setTimeout(() => {
  //     navigate('LoginPage');
  //   }, 1000); // Match this duration with the animation duration in CSS
  // };

  return (
    <div onClick={routeChange} >
      <section className="home">
        
        <div className="home-content">
          <h1>APEX Business Acadamy (Pvt) Ltd</h1>
          <p>This is a APEX Business Acadamy Offical Website. All of Student,Teachers can used this site</p>
          <p>Contact No: <span>091-5486912</span> <br/>
          Address: <span>104/B, Rahula Road, Mathara</span></p>
        </div>

        <div className='home-img'>
          <div className='rhombus'>
            <img src={Side}/>
          </div>
        </div>
          <div className='rhombus2'></div>

      </section>
      <div className="overlay"></div>
    </div>
    // <div className="container">
    //   <div className='maincontainerlogin'>
    //     <img src={Img1} alt='Image' className='loginImage'/>
    //   </div>
    //   <div className='secondcontainer'>
    //     <div className='nameofacadamy'>APEX Business Acadamy <br/> (pvt) LTD</div>
    //     <div className='nameofwelcome'>This is a APEX Business Acadamy Offical Website. All of Student,Teachers can used this site</div>
    //   <button onClick={routeChange} className='btnLogin'>
    //     Log In
    //   </button>
    //   </div>
    // </div>
  )
}

export default LoginPageHome
