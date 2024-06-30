import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import './TeacherDetailsStyles.css';

const ClassesDetails = () => {
  const [classesDetails, setClassesDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newDay, setNewDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassesDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/subject/${id}`);
        setClassesDetails(response.data);
        setNewDay(response.data.day);
        const [start, end] = response.data.timeRange.replace(/\s/g, "").split("-");
        setStartTime(start);
        setEndTime(end);
      } catch (error) {
        console.error("Error fetching Classes details:", error);
      }
    };

    fetchClassesDetails();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset the values to their original state
    setNewDay(classesDetails.day);
    const [start, end] = classesDetails.timeRange.replace(/\s/g, "").split("-");
    setStartTime(start);
    setEndTime(end);
  };

  const handleSave = async () => {
    const newTimeRange = `${startTime} - ${endTime}`;
    try {
      await axios.put(`http://localhost:8085/api/v1/subject/${id}/updateDateAndTime`, {
        newDay,
        newTimeRange
      });
      Swal.fire("Success", "Class schedule updated successfully", "success");
      setIsEditing(false);
      // Refetch the updated details
      const response = await axios.get(`http://localhost:8085/api/v1/subject/${id}`);
      setClassesDetails(response.data);
    } catch (error) {
      console.error("Error updating class schedule:", error);
      Swal.fire("Error", "Failed to update class schedule", "error");
    }
  };


  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8085/api/v1/subject/${id}`);
          Swal.fire("Deleted!", "Class has been deleted.", "success");
          navigate("/"); // Navigate to the home page or another relevant page after deletion
        } catch (error) {
          console.error("Error deleting class:", error);
          Swal.fire("Error", "Failed to delete class", "error");
        }
      }
    });
  };

  return (
    <>
      <div className="student-details-container">
        <h2>Class Details</h2>
        <div className="card-container">
          <div className="card detail-item">
            <span className="detail-label">Class ID :</span>
            <span className="detail-value">{classesDetails.subjectid}</span>
          </div>
          <div className="card detail-item">
            <span className="detail-label">Teacher Name :</span>
            <span className="detail-value">{classesDetails.teacher?.teachername}</span>
          </div>
          <div className="card detail-item">
            <span className="detail-label">Subject :</span>
            <span className="detail-value">{classesDetails.subjectname}</span>
          </div>
          <div className="card detail-item">
            <span className="detail-label">Medium :</span>
            <span className="detail-value">{classesDetails.medium}</span>
          </div>
          <div className="card detail-item">
            <span className="detail-label">Class Fee :</span>
            <span className="detail-value">Rs.{classesDetails.classfee}.00</span>
          </div>
           {/* Editable Class Schedule Time Section */}
          <div  className="card detail-item" >
            <span className="detail-label">Class Schedule Time :</span>
            {isEditing ? (
              <div className="clsselect-dropdown" style={{ display:"inline-block", alignItems: "center" }}>
                <select  value={newDay} onChange={(e) => setNewDay(e.target.value)}>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
                <div className="clstime-input" style={{display:"inline-block", alignItems: "center" }}>
                  <label htmlFor="startTime" style={{marginRight:5,fontWeight:"bold"}}>Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="clstime-input" style={{display:"inline-block", alignItems: "center" }}>
                  <label htmlFor="endTime" style={{marginRight:5, fontWeight:"bold"}}>End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <span className="detail-value">
                {classesDetails.day} {classesDetails.timeRange}
              </span>
            )}
          </div>
          </div>
          <div>
          {isEditing ? (
              <>
                <button className="clssave-button" onClick={handleSave}>Save</button>
                <button className="clscancel-button" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
              <button className="clsedit-button" onClick={handleEdit}>Edit</button>
              <button className="clsdelete-button" onClick={handleDelete}>Delete</button>
              </>
              
            )}
          </div>
        </div>
    </>
  );
};

export default ClassesDetails;
