import React, { useEffect, useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from 'axios';
import StudentMale from '../../../assets/images/StudentMale.png';
import StudentFemale from '../../../assets/images/StudentFemale.png';
import Swal from 'sweetalert2';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBRadio,
} from 'mdb-react-ui-kit';
import PasswordChange from './PasswordChange';

export default function ProfilePage() {
  const [enrollments, setEnrollments] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [errors, setErrors] = useState({});
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/student/${studentId}`);
        setEnrollments(response.data);
        setEditFields(response.data);
      } catch (error) {
        console.error('Error fetching enrollments', error);
      }
    };

    fetchEnrollments();
  }, [studentId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditFields(enrollments);
  };

  const validateFields = () => {
    const errors = {};
    if (!editFields.studentname) errors.studentname = 'Full Name is required';
    if (!editFields.email) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFields.email)) {
        errors.email = 'Invalid email format';
      }
    }
    if (!editFields.address) errors.address = 'Address is required';
    if (!editFields.phonenumber) {
      errors.phonenumber = 'Phone Number is required';
    } else {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(editFields.phonenumber)) {
        errors.phonenumber = 'Invalid phone number';
      }
    }
    if (!editFields.dob) errors.dob = 'Date of Birth is required';
    if (!editFields.parentsname) errors.parentsname = 'Parents/Legal Guardian Name is required';
    if (!editFields.medium) errors.medium = 'Medium is required';
    if (!editFields.grade) errors.grade = 'Grade is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveClick = async () => {
    if (!validateFields()) {
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to save the changes?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`http://localhost:8085/api/v1/student/update/${studentId}`, editFields);
        setEnrollments(response.data);
        setIsEditing(false);
        Swal.fire(
          'Saved!',
          'Your changes have been saved.',
          'success'
        );
      } catch (error) {
        console.error('Error updating student information', error);
        Swal.fire(
          'Error!',
          'An error occurred while saving your changes.',
          'error'
        );
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFields({
      ...editFields,
      [name]: value,
    });
  };

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <>
                {enrollments.gender === "Male" ? 
                <MDBCardImage
                src={StudentMale}
                alt="avatar"
                className="rounded-circle"
                style={{ width: '150px' }}
                fluid />
                : 
                <MDBCardImage
                  src={StudentFemale}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                }
                </>
                <p style={{marginTop:10}} className="text-muted mb-1">{enrollments.studentid}</p>
              </MDBCardBody>
            </MDBCard>
            <PasswordChange/>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                {[
                  { label: 'Full Name', value: 'studentname' },
                  { label: 'Email', value: 'email' },
                  { label: 'Address', value: 'address' },
                  { label: 'Mobile', value: 'phonenumber' },
                  { label: 'Parents/Legal Guardian Name', value: 'parentsname' },
                  { label: 'Grade', value: 'grade' },
                ].map((field, index) => (
                  <div key={index}>
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>{field.label}</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              className="form-control"
                              name={field.value}
                              value={editFields[field.value] || ''}
                              onChange={handleInputChange}
                            />
                            {errors[field.value] && (
                              <div className="text-danger">{errors[field.value]}</div>
                            )}
                          </>
                        ) : (
                          <MDBCardText className="text-muted">{enrollments[field.value]}</MDBCardText>
                        )}
                      </MDBCol>
                    </MDBRow>
                    <hr />
                  </div>
                ))}
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Date of Birth</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <>
                        <input
                          type="date"
                          className="form-control"
                          name="dob"
                          value={editFields.dob || ''}
                          onChange={handleInputChange}
                        />
                        {errors.dob && (
                          <div className="text-danger">{errors.dob}</div>
                        )}
                      </>
                    ) : (
                      <MDBCardText className="text-muted">{enrollments.dob}</MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Gender</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <div>
                        <MDBRadio
                          name="gender"
                          id="male"
                          label="Male"
                          value="Male"
                          checked={editFields.gender === 'Male'}
                          onChange={handleInputChange}
                        />
                        <MDBRadio
                          name="gender"
                          id="female"
                          label="Female"
                          value="Female"
                          checked={editFields.gender === 'Female'}
                          onChange={handleInputChange}
                        />
                        {errors.gender && (
                          <div className="text-danger">{errors.gender}</div>
                        )}
                      </div>
                    ) : (
                      <MDBCardText className="text-muted">{enrollments.gender}</MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Medium</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <div>
                        <MDBRadio
                          name="medium"
                          id="sinhala"
                          label="Sinhala"
                          value="Sinhala"
                          checked={editFields.medium === 'Sinhala'}
                          onChange={handleInputChange}
                        />
                        <MDBRadio
                          name="medium"
                          id="english"
                          label="English"
                          value="English"
                          checked={editFields.medium === 'English'}
                          onChange={handleInputChange}
                        />
                        {errors.medium && (
                          <div className="text-danger">{errors.medium}</div>
                        )}
                      </div>
                    ) : (
                      <MDBCardText className="text-muted">{enrollments.medium}</MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Register Date</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.registrationdate}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                {!isEditing ? (
                  <MDBBtn style={{backgroundColor:"#007bff",fontSize:14}} onClick={handleEditClick}>Edit</MDBBtn>
                ) : (
                  <>
                    <MDBBtn style={{backgroundColor:"#28a745"}} onClick={handleSaveClick}>Save</MDBBtn>
                    <MDBBtn style={{marginLeft:10,backgroundColor:"#d9544f"}} color="danger" onClick={handleCancelClick}>Cancel</MDBBtn>
                  </>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
