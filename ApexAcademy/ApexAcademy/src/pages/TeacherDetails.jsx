import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import './TeacherDetailsStyles.css';

const TeacherDetails = () => {
  const [teacherDetails, setTeacherDetails] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/teacher/${id}`);
        setTeacherDetails(response.data);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    };

    fetchTeacherDetails();
  }, [id]);

  const handleDelete = async () => {
    Swal.fire({
      title: 'Delete Teacher',
      text: "Do you want to delete this teacher?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8085/api/v1/teacher/${id}`);
          Swal.fire(
            'Deleted!',
            'The teacher has been deleted.',
            'success'
          );
          navigate("/teachers");
        } catch (error) {
          console.error("Error deleting teacher:", error);
          Swal.fire(
            'Error!',
            'There was an error deleting the teacher.',
            'error'
          );
        }
      }
    });
  };

  return (
    <>
      <div className="teacher-details-container">
        <h2>Teacher Details</h2>
        <div className="teacher-details-card">
          <div className="detail-item">
            <span className="detail-label">Teacher ID:</span>
            <span className="detail-value">{teacherDetails.teacherid}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Teacher Name:</span>
            <span className="detail-value">{teacherDetails.teachername}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{teacherDetails.address}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date of Birth:</span>
            <span className="detail-value">{teacherDetails.dob}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{teacherDetails.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone Numbers:</span>
            <ul className="phone-numbers-list">
              {teacherDetails.phoneNumbers && teacherDetails.phoneNumbers.map((number, index) => (
                <li key={index}>{number}</li>
              ))}
            </ul>
          </div>
          <div className="detail-item">
            <span className="detail-label">Medium:</span>
            <span className="detail-value">{teacherDetails.medium}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Grades:</span>
            <ul className="grades-list">
              {teacherDetails.grade && teacherDetails.grade.map((grade, index) => (
                <li key={index}>{grade}</li>
              ))}
            </ul>
          </div>
          <div className="detail-item">
            <span className="detail-label">Registration Date:</span>
            <span className="detail-value">{teacherDetails.registrationdate}</span>
          </div>
        </div>
        <div>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </>
  );
};

export default TeacherDetails;
