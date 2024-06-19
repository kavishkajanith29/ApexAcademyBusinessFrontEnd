import './LoginPage.css'
import { PiStudentLight } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { Link} from 'react-router-dom';
import Img1 from '../assets/images/img1.jpg';
//import Img1 from '../assets/images/img1.jpg'

const LoginPage = () => {
  return (
    <div className='maincontainer'>
      <div className='maincontainerlogins'>
            <img src={Img1} alt='Image' className='loginImage' />
            </div>
      <Link to='/LoginPage/teacher' className='link-class'>
      <div className='teacher'>
      <button className='btn'>
            <GiTeacher className='btnicon'/> 
            <br/>
            <div className='btnname'>
            Teacher
            </div>
            <div className='btndecription'>Login as a teacher to create course <br/>
                  assignments.</div>
        </button>
      </div>
      </Link>
      
      <Link to='/LoginPage/student' className='link-class'>
      <div className='student'>
      <button className='btn' >
            <PiStudentLight className='btnicon'/> 
            <br/>
            <div className='btnname'>
            Student
            </div>
            <div className='btndecription'>Login as a student to explore course <br/>
                 materials and assignments.</div>
        </button>
      </div>
      </Link>
    </div>
  )
}

export default LoginPage
