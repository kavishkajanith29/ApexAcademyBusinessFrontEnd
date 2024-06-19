import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"; 
import axios from 'axios';
import './PaymentGuidance.css'; // Import the CSS file
import Img1 from '../assets/images/img1.jpg';

function RegistrationSuccsusful() {
    const [studentDetails, setStudentDetails] = useState({});
    const [registrationFee, setRegistrationFee] = useState(null);
    const { id } = useParams(); 

    useEffect(() => {
        const fetchStudentDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:8085/api/v1/student/${id}`); 
            setStudentDetails(response.data);
          } catch (error) {
            console.error("Error fetching student details:", error);
          }
        };
    
        fetchStudentDetails();
    }, [id]); 

    useEffect(() => {
      const fetchClassFee = async () => {
        try {
          const response = await axios.get('http://localhost:8085/classfee/all');
          const classFee = response.data.find(fee => fee.medium === 'ALL' && fee.grade === 'ALL');
          setRegistrationFee(classFee ? classFee.fee : null);
        } catch (error) {
          console.error('Error fetching class fee:', error);
        }
      };
  
      fetchClassFee();
    }, []);

  return (
    <div className="clssregister " >
        <div className='maincontainerlogin'>
            <img src={Img1} alt='Image' className='loginImages' />
            </div>
            <div>

            </div>
    <div className="payment-guidance-container">
    <div className="headerOfregister">
      <h2>Student Online Self Registration</h2>
      <h3>APEX Business Acadamy(pvt) LTD</h3>
      </div>
      <h4 className="payment-guidance-heading">Payment Guidance</h4>
      <p className="payment-guidance-paragraph">
        To complete your registration, please follow these steps to make the payment via bank deposit:
      </p>
      <ol className="payment-guidance-list">
        <li>Visit your nearest bank branch, ATM, or Online Banking App.</li>
        <li>Deposit the registration fee (Rs.{registrationFee}.00) to the following bank account:</li>
      </ol>
      <p className="payment-guidance-details">
        <span className="font-bold">Bank Name:</span> Bank of Ceylon <br />
        <span className="font-bold">Branch:</span> Matara <br />
        <span className="font-bold">Account Name:</span> Apex Business Academy <br />
        <span className="font-bold">Account Number:</span> 123456 <br />
        <span className="font-bold">Institute Number:</span> 0123456789
      </p>
      <ol className="payment-guidance-list" start={3}>
        <li>After making the deposit, please take a clear photo of the deposit receipt.</li>
        <li>Send the deposit receipt photo along with your full name and student number to our WhatsApp number: 0123456789.</li>
      </ol>
      <p className="payment-guidance-paragraph">
        Once we receive your deposit receipt, we will process your registration and send you a confirmation via Email.
        If you encounter any issues during the payment process, please contact our support team for assistance.
      </p>
    </div>
    <div className="important-notice">
        <h1 style={{color:"#48BB78",textAlign:"center"}} >Registration Succsusful !</h1>
        <p style={{width:"70%",marginLeft:"15%",marginRight:"15%"}}>Please remember the password and send a photo of the payment receipt with the Student Number and Full Name to our WhatsApp number: 0123456789.</p>
        </div>
    <div className="card-container">
      <div className="card detail-item">
        <span className="detail-label">Student Number:</span>
        <span className="detail-value">{studentDetails.studentid}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Student Name:</span>
        <span className="detail-value">{studentDetails.studentname}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Address:</span>
        <span className="detail-value">{studentDetails.address}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">School:</span>
        <span className="detail-value">{studentDetails.school}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Date of Birth:</span>
        <span className="detail-value">{studentDetails.dob}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Parent{"'"}s Name:</span>
        <span className="detail-value">{studentDetails.parentsname}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Parent{"'"}s Occupation:</span>
        <span className="detail-value">{studentDetails.parentsoccupation}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Email:</span>
        <span className="detail-value">{studentDetails.email}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Phone Number:</span>
        <span className="detail-value">{studentDetails.phonenumber}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Medium:</span>
        <span className="detail-value">{studentDetails.medium}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Registered Grade:</span>
        <span className="detail-value">{studentDetails.grade}</span>
      </div>
      <div className="card detail-item">
        <span className="detail-label">Registration Date:</span>
        <span className="detail-value">{studentDetails.registrationdate}</span>
      </div>
    </div>
    </div>
  );
}

export default RegistrationSuccsusful;
