import { Button, Form, Table } from 'react-bootstrap';
import "./AreaTable.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const TABLE_HEADS = [
  "Subject ID",
  "Subject",
  "Teacher Name",
  "Medium",
  "Schedule Time",
  " ",
  " ",
];

function MessageForm() {
  const initialFormData = {
    studentId: '',  
  };
  const [formData, setFormData] = useState(initialFormData);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollments, setSelectedEnrollments] = useState({});
  const [paymentFormVisible, setPaymentFormVisible] = useState(false);
  const [paymentData, setPaymentData] = useState({
    month: '',
    amount: 0,
  });
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage, setPaymentsPerPage] = useState(5);

  useEffect(() => {
    // Function to fetch initial data or reset
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/enrollment/student/${formData.studentId}`);
        setEnrollments(response.data);

        // Fetch all payment data
        const paymentResponse = await axios.get(`http://localhost:8085/api/v1/fees/all`);
        const studentPayments = paymentResponse.data.filter(payment => payment.enrollment.student.studentid === formData.studentId);

        // Sort payments by paymentDate in descending order
        studentPayments.sort((a, b) => {
          return new Date(b.paymentDate) - new Date(a.paymentDate) || b.month.localeCompare(a.month);
        });

        setPayments(studentPayments);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (formData.studentId !== '') {
      fetchData();
    } else {
      setEnrollments([]);
      setSelectedEnrollments({});
      setPaymentFormVisible(false);
      setPaymentData({ month: '', amount: 0 });
      setPayments([]);
    }
  }, [formData.studentId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleCheckboxChange = (e, enrollment) => {
    const { checked } = e.target;
    const updatedSelectedEnrollments = { ...selectedEnrollments };

    if (checked) {
      updatedSelectedEnrollments[enrollment.enrollmentId] = enrollment;
    } else {
      delete updatedSelectedEnrollments[enrollment.enrollmentId];
    }

    setSelectedEnrollments(updatedSelectedEnrollments);

    if (Object.keys(updatedSelectedEnrollments).length > 0) {
      setPaymentFormVisible(true);
      const totalAmount = Object.values(updatedSelectedEnrollments).reduce(
        (sum, item) => sum + parseFloat(item.subject.classfee),
        0
      );
      setPaymentData({ ...paymentData, amount: totalAmount });
    } else {
      setPaymentFormVisible(false);
    }
  };

  const handlePaymentChange = (e) => {
    const { id, value } = e.target;
    setPaymentData({
      ...paymentData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8085/api/v1/enrollment/student/${formData.studentId}`);
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const promises = Object.values(selectedEnrollments).map((enrollment) =>
        axios.post('http://localhost:8085/api/v1/fees/pay', {
          enrollmentId: enrollment.enrollmentId,
          month: paymentData.month,
          amount: enrollment.subject.classfee,
        }).then(response => ({ status: 'fulfilled', enrollment, response }))
          .catch(error => ({ status: 'rejected', enrollment, error }))
      );

      const results = await Promise.all(promises);
      console.log(results);

      const successfulPayments = results.filter(result => result.response && result.response.data.statusCodeValue === 200);
      const failedPayments = results.filter(result => result.response && result.response.data.statusCodeValue === 400);

      if (successfulPayments.length > 0) {
        Swal.fire({
          icon: 'success',
          title: 'Payment successful',
          text: `${successfulPayments.length} payments have been processed successfully.`,
        });
      }

      if (failedPayments.length > 0) {
        const errorMessages = failedPayments.map(result => {
          const errorResponse = result.response;
          const enrollment = result.enrollment;
          const errorMessage = errorResponse.data.body; // Separate line for error message

          return `Subject ID: ${enrollment.subject.subjectid}, Subject: ${enrollment.subject.subjectname}, ${"ErrorMessage"}  ${errorMessage}`;
        }).join('<br>');  // Using <br> to insert line breaks in HTML

        Swal.fire({
          icon: 'error',
          title: 'Payment errors',
          html: `Some payments could not be processed:<br>${errorMessages}`,  // Using html instead of text
        });
      }
    } catch (error) {
      console.error('Unexpected error during payment processing:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment error',
        text: 'There was an unexpected error processing the payments. Please try again.',
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEnrollments([]);
    setSelectedEnrollments({});
    setPaymentFormVisible(false);
    setPaymentData({ month: '', amount: 0 });
    setPayments([]);
  };

  // Pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="classregister" style={{ marginTop: 30 }}>
      <div>
        <Form onSubmit={handleSubmit}>
          <fieldset>
            <div style={{ display: 'flex' }}>
              <Form.Group className="mb-3" style={{ width: "500px", marginRight: '10px' }}>
                <Form.Control
                  id="studentId"
                  placeholder="Enter Student ID"
                  onChange={handleChange}
                  value={formData.studentId}
                  required
                />
              </Form.Group>
              <Button type="submit" className="mb-3" style={{ marginTop: 0, marginRight: '10px', fontSize: 18, textAlign: "center", alignItems: "center" }}>Search</Button>
              <Button type="button" className="mb-3" onClick={resetForm} style={{ marginTop: 0, marginRight: '10px', fontSize: 18, textAlign: "center", alignItems: "center" }}>Reset</Button>
            </div>
          </fieldset>
        </Form>
      </div>
      {enrollments.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Select</th>
              <th>Subject ID</th>
              <th>Subject Name</th>
              <th>Teacher Name</th>
              <th>Class Fee</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.enrollmentId}>
                <td>
                  <Form.Check
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(e, enrollment)}
                  />
                </td>
                <td>{enrollment.subject.subjectid}</td>
                <td>{enrollment.subject.subjectname}</td>
                <td>{enrollment.subject.teacher.teachername}</td>
                <td>{"Rs."}{enrollment.subject.classfee}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {paymentFormVisible && (
        <div style={{ display: 'flex' }}>
          <Form onSubmit={handlePaymentSubmit}>
            <Form.Group className="mb-3" style={{ display: "inline-block", width: "300px" }}>
              <Form.Label>Month</Form.Label>
              <Form.Control
                id="month"
                type="month"
                onChange={handlePaymentChange}
                value={paymentData.month}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" style={{ display: "inline-block", width: "300px", marginLeft: 10, marginRight: 10 }}>
              <Form.Label>Total Amount <b>Rs.</b></Form.Label>
              <Form.Control
                id="amount"
                value={paymentData.amount}
                readOnly
              />
            </Form.Group>
            <Button type="submit" className="mb-3" style={{ marginTop: 10 }}>Confirm Payment</Button>
          </Form>
        </div>
      )}
      {currentPayments.length > 0 ? (
        <div>
          <Table striped bordered hover responsive style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Subject ID</th>
                <th>Subject Name</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment) => (
                <tr key={payment.feeId}>
                  <td>{payment.enrollment.subject.subjectid}</td>
                  <td>{payment.enrollment.subject.subjectname}</td>
                  <td>{payment.month}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Pagination */}
          <ul className="pagination">
            {paymentsPerPage !== 0 && (
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button onClick={() => paginate(currentPage - 1)} className="page-link">Previous</button>
              </li>
            )}
            {Array.from({ length: Math.ceil(payments.length / paymentsPerPage) }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
              </li>
            ))}
            {paymentsPerPage !== 0 && (
              <li className={`page-item ${currentPage === Math.ceil(payments.length / paymentsPerPage) ? 'disabled' : ''}`}>
                <button onClick={() => paginate(currentPage + 1)} className="page-link">Next</button>
              </li>
            )}
          </ul>
        </div>
      ) : (
        enrollments.length > 0 && <p>No payments found for this student.</p>
      )}
    </div>
  );
}

export default MessageForm;
