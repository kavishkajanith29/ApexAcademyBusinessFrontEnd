function PaymentGuidance() {
  return (
    <div>
      <h4>Payment Guidance</h4>
      <p>
        To complete your registration, please follow these steps to make the payment via bank deposit:
      </p>
      <ol>
        <li>Visit your nearest bank branch,ATM or Online Banking App.</li>
        <li>Deposit the registration fee to the following bank account:</li>
      </ol>
      <p>
        Bank Name: Bank of Ceylon <br />
        Account Name: Apex Business Academy<br />
        Account Number: 123456<br />
        Institute Number: 0123456789
      </p>
      <ol start={3}>
        <li>After making the deposit, please take a clear photo of the deposit receipt.</li>
        <li>Send the deposit receipt photo along with your full name and registration details to our WhatsApp number: 0123456789.</li>
      </ol>
      <p>
        Once we receive your deposit receipt, we will process your registration and send you a confirmation via Email.
        If you encounter any issues during the payment process, please contact our support team for assistance.
      </p>
    </div>
  );
}

export default PaymentGuidance;
