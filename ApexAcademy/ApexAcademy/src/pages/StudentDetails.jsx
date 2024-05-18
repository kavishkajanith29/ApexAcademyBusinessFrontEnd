import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";
import Swal from "sweetalert2";
import './StudentDetailsStyles.css';

const StudentDetails = () => {
  const [studentDetails, setStudentDetails] = useState({});
  const { id } = useParams(); 
  const navigate = useNavigate(); 

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

  const handleApprove = async () => {
    Swal.fire({
      title: 'Approve Student',
      text: "Do you want to approve this student?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`http://localhost:8085/api/v1/student/${id}/approve`);
          setStudentDetails({ ...studentDetails, approved: true });
          Swal.fire(
            'Approved!',
            'The student has been approved.',
            'success'
          );
        } catch (error) {
          console.error("Error approving student:", error);
          Swal.fire(
            'Error!',
            'There was an error approving the student.',
            'error'
          );
        }
      }
    });
  };

  const handleDelete = async () => {
    Swal.fire({
      title: 'Delete Student',
      text: "Do you want to delete this student?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8085/api/v1/student/${id}`);
          Swal.fire(
            'Deleted!',
            'The student has been deleted.',
            'success'
          );
          navigate("/students"); 
        } catch (error) {
          console.error("Error deleting student:", error);
          Swal.fire(
            'Error!',
            'There was an error deleting the student.',
            'error'
          );
        }
      }
    });
  };

  return (
    <>
    <div className="student-details-container">
      <h2>Student Details</h2>
      <div className="student-details-card">
        <div className="detail-item">
          <span className="detail-label">Student ID:</span>
          <span className="detail-value">{studentDetails.studentid}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Student Name:</span>
          <span className="detail-value">{studentDetails.studentname}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Address:</span>
          <span className="detail-value">{studentDetails.address}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">School:</span>
          <span className="detail-value">{studentDetails.school}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Date of Birth:</span>
          <span className="detail-value">{studentDetails.dob}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Parent's Name:</span>
          <span className="detail-value">{studentDetails.parentsname}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Parent's Occupation:</span>
          <span className="detail-value">{studentDetails.parentsoccupation}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{studentDetails.email}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Phone Number:</span>
          <span className="detail-value">{studentDetails.phonenumber}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Medium:</span>
          <span className="detail-value">{studentDetails.medium}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Grade:</span>
          <span className="detail-value">{studentDetails.grade}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Registration Date:</span>
          <span className="detail-value">{studentDetails.registrationdate}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Approved:</span>
          <span className="detail-value">
            {studentDetails.approved ? "Yes" : "No"}
          </span>
        </div>
      </div>
      <div>
        {!studentDetails.approved && (
          <span>
            <button className="approve-button" onClick={handleApprove}>Approve</button>
          </span>
        )}
        <span>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
        </span>
      </div>
    </div>
    </>
  );
};

export default StudentDetails;
