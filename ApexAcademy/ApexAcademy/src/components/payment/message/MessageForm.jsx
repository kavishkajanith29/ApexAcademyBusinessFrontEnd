import { Button, Form ,Table } from 'react-bootstrap';
import "./AreaTable.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useState,useEffect } from 'react';

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
      console.error('Error fetching enrollments:', error);
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
        })
      );
      console.log(promises);
      await Promise.all(promises);
      
    } catch (error) {
      console.error('Error processing payments:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEnrollments([]);
    setSelectedEnrollments({});
    setPaymentFormVisible(false);
    setPaymentData({ month: '', amount: 0 });
  };

  return (
    <div className="classregister">
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Group className="mb-3" style={{ marginBottom: 0, marginRight: '10px' }}>
              <Form.Control
                id="studentId"
                placeholder="Enter Student ID"
                onChange={handleChange}
                value={formData.studentId}
                required
              />
            </Form.Group>
            <Button type="submit" className="mb-3" style={{ marginTop: 0, marginRight: '10px' }}>Search</Button>
            <Button type="button" className="mb-3" onClick={resetForm} style={{ marginTop: 0 }}>Reset</Button>
          </div>
        </fieldset>
      </Form>
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
        <Form onSubmit={handlePaymentSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Month</Form.Label>
            <Form.Control
              id="month"
              type="month"
              onChange={handlePaymentChange}
              value={paymentData.month}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Total Amount Rs.</Form.Label>
            <Form.Control
              id="amount"
              value={paymentData.amount}
              readOnly
            />
          </Form.Group>
          <Button type="submit" className="mb-3">Pay Fee</Button>
        </Form>
      )}
    </div>
  );
}

export default MessageForm;
