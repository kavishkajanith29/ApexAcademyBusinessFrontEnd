import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AreaProgressChart = () => {
  const navigate = useNavigate();
  const [registrationFee, setRegistrationFee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFee, setNewFee] = useState('');

  useEffect(() => {
    const fetchClassFee = async () => {
      try {
        const response = await axios.get('http://localhost:8085/classfee/all');
        const classFee = response.data.find(fee => fee.medium === 'ALL' && fee.grade === 'ALL');
        setRegistrationFee(classFee ? classFee.fee : null);
        setNewFee(classFee ? classFee.fee : '');
      } catch (error) {
        console.error('Error fetching class fee:', error);
      }
    };

    fetchClassFee();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewFee(registrationFee);
  };

  const handleUpdate = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to update the fee?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!'
    });

    if (result.isConfirmed) {
      try {
        await axios.put('http://localhost:8085/classfee/update/ALL', {
          grade: 'ALL',
          newFee: newFee
        });
        setRegistrationFee(newFee);
        setIsEditing(false);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'The fee has been updated successfully.',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'There was an error updating the fee.',
          confirmButtonText: 'OK'
        });
        console.error('Error updating class fee:', error);
      }
    }
  };

  const handleAnualViewReport = () => {
    navigate('/report/reportgenerate'); 
  };
  
  const handleMonthlyViewReport = () => {
    navigate('/report/monthlyreportgenerate'); 
  };

  return (
    <div className="progress-bar">
      <div style={{height:150}}>
        <span><h3>Student Registration Fee</h3></span>
        {isEditing ? (
          <div style={{ display: 'inline-block' }}>
          <h4 style={{ display: 'inline-block' }}>Rs. </h4>
          <Form.Control
            type="text"
            value={newFee}
            onChange={e => setNewFee(e.target.value)}
            style={{ 
              display: 'inline-block', 
              width: 'auto', 
              marginLeft: '5px',
              fontWeight: '500',
              fontSize: '25px' ,
              width:'250px'
             }}
          />
        </div>
        ) : (
          <span>{registrationFee !== null ? <h4>Rs.{registrationFee}.00</h4>: 'Loading...'}</span>
        )}
        {isEditing ? (
          <div style={{marginTop: 0}}>
            <Button className="btn btn-update" style={{width:100}} onClick={handleUpdate}>Update</Button>
            <Button className="btn btn-cancel" style={{width:100,marginLeft:50}} variant="secondary" onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <div>
            <Button style={{width:100,marginTop: 10}} onClick={handleEdit}>Edit</Button>
          </div>
        )}
      </div>
      <div>
        <Button onClick={handleMonthlyViewReport}>View Monthly Report</Button>
      </div>
      <div>
        <Button onClick={handleAnualViewReport}>View Annual Report</Button>
      </div>
    </div>
  );
};

export default AreaProgressChart;
