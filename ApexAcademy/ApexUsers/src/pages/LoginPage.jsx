import './LoginPage.css'
import { PiStudentLight } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { Link} from 'react-router-dom';
import Img1 from '../assets/images/img1.jpg';

const LoginPage = () => {
  return (
    <div className='maincontainer home'>
      <div className='maincontainerlogins ' >
            <img src={Img1} alt='Image' className='loginImage' />
            </div>
      <Link to='/LoginPage/teacher' className='link-class'>
      <div className='teacher' style={{marginLeft:"-47%"}}>
      <button className='btn'>
            <GiTeacher className='btnicon'/> 
            <br/>
            <div className='btnname'>
            Teacher
            <p>Login as a teacher to manage classes & exams.</p>
            </div>
        </button>
      </div>
      </Link>
      
      <Link to='/LoginPage/student' className='link-class'>
      <div className='student' style={{marginLeft:"-10%"}}>
      <button className='btn' >
            <PiStudentLight className='btnicon'/> 
            <br/>
            <div className='btnname'>
            Student
            <p>Login as a student to explore classess progress.</p>
            </div>
        </button>
      </div>
      </Link>
      {/* <div className='rhombus2'></div> */}
    </div>
  )
}

export default LoginPage
