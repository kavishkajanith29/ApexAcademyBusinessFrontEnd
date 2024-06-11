import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import './TeacherDetailsStyles.css';

const ClassesDetails = () => {
  const [classesDetails, setClassesDetails] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassesDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/subject/${id}`);
        setClassesDetails(response.data);
      } catch (error) {
        console.error("Error fetching Classes details:", error);
      }
    };

    fetchClassesDetails();
  }, [id]);

//   const handleDelete = async () => {
//     Swal.fire({
//       title: 'Delete Classes',
//       text: "Do you want to delete this Class?",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Delete',
//       cancelButtonText: 'Cancel'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`http://localhost:8085/api/v1/teacher/${id}`);
//           Swal.fire(
//             'Deleted!',
//             'The Class has been deleted.',
//             'success'
//           );
//           navigate("/classes");
//         } catch (error) {
//           console.error("Error deleting Class:", error);
//           Swal.fire(
//             'Error!',
//             'There was an error deleting the Class.',
//             'error'
//           );
//         }
//       }
//     });
//   };

  return (
    <>
      <div className="teacher-details-container">
        <h2>Class Details</h2>
        <div className="teacher-details-card">
          <div className="detail-item">
            <span className="detail-label">Class ID :</span>
            <span className="detail-value">{classesDetails.subjectid}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Teacher Name :</span>
            <span className="detail-value">{classesDetails.teacher?.teachername}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Subject :</span>
            <span className="detail-value">{classesDetails.subjectname}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Medium :</span>
            <span className="detail-value">{classesDetails.medium}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Class Shedule Time :</span>
            <span className="detail-value">{classesDetails.day} {classesDetails.timeRange}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Class Fee :</span>
            <span className="detail-value">{classesDetails.classfee}</span>
          </div>
          {/* <button className="delete-button" onClick={handleDelete}>Delete</button> */}
        </div>
      </div>
    </>
  );
};

export default ClassesDetails;
