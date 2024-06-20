import { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentGuidance.css'; // Import the CSS file

function PaymentGuidance() {
  const [registrationFee, setRegistrationFee] = useState(null);

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
  );
}

export default PaymentGuidance;
