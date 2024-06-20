import { useNavigate } from "react-router-dom";
import './LoginPageHome.css';
import Side from '../assets/apex.jpg';
import LogoBlue from "../assets/images/logo_blue.svg";

const LoginPageHome = () => {
  let navigate = useNavigate(); 

  const routeChange = () => { 
    let path = `LoginPage`; 
    navigate(path);
  }

  return (
    <div onClick={routeChange}>
      <section className="home">
        <div className="logo-container">
          <img className="logo" src={LogoBlue} alt="Logo" />
        </div>
        <div className="home-content">
          <h1>Welcome to <br /> APEX Business Academy (Pvt) Ltd</h1>
          <p>This is an APEX Business Academy Official Website. All Teachers & Students can use this website.</p>
          <p>Contact No: <span>091-5486912</span> <br />
          Address: <span>104/B, Rahula Road, Mathara</span></p>
        </div>
        <div className='home-img'>
          <div className='rhombus'>
            <img src={Side} alt="Side Image" />
          </div>
        </div>
        <div className='rhombus2'></div>
      </section>
      <div className="overlay"></div>
    </div>
  )
}

export default LoginPageHome;
