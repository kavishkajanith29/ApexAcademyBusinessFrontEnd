import { useNavigate } from "react-router-dom";

import './LoginPageHome.css'
import Side from '../assets/apex.jpg'

const LoginPageHome = () => {

let navigate = useNavigate(); 

  const routeChange = () =>{ 
    let path = `LoginPage`; 
    navigate(path);
  }
  return (
    <div onClick={routeChange} >
      <section className="home">
        
        <div className="home-content">
          <h1>Welcome to <br /> APEX Business Acadamy (Pvt) Ltd</h1>
          <p>This is a APEX Business Acadamy Offical Website. All of Teachers & Students can used this web site.</p>
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
  )
}

export default LoginPageHome
