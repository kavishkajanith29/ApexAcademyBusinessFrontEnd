import { useEffect, useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from 'axios';
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
  MDBCheckbox
} from 'mdb-react-ui-kit';
import PasswordChange from './PasswordChange';
import TeacherMale from '../../../assets/images/TeacherMale.png';
import TeacherFemale from '../../../assets/images/TeacherFemale.png';

export default function TeacherProfilePage() {
  const [teacherDetails, setTeacherDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    phoneNumbers: [],
    workingPlaces: [],
    grade: []
  });
  const [errors, setErrors] = useState({});
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/teacher/${teacherId}`);
        const data = response.data;
        // Ensure phoneNumbers, workingPlaces, and grade are arrays
        data.phoneNumbers = data.phoneNumbers || [];
        data.workingPlaces = data.workingPlaces || [];
        data.grade = data.grade || [];
        setTeacherDetails(data);
        setEditFields(data);
      } catch (error) {
        console.error('Error fetching teacher details', error);
      }
    };

    fetchTeacherDetails();
  }, [teacherId]);

  useEffect(() => {
    console.log('teacherDetails:', teacherDetails);
    console.log('editFields:', editFields);
  }, [teacherDetails, editFields]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditFields(teacherDetails);
  };

  const validateFields = () => {
    const errors = {};
    if (!editFields.teachername) errors.teachername = 'Full Name is required';
    if (!editFields.email) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFields.email)) {
        errors.email = 'Invalid email format';
      }
    }
    if (!editFields.address) errors.address = 'Address is required';
    if (!editFields.phoneNumbers || editFields.phoneNumbers.length === 0) {
      errors.phoneNumbers = 'At least one Phone Number is required';
    } else {
      const phoneRegex = /^0\d{9}$/;
      editFields.phoneNumbers.forEach((phone, index) => {
        if (!phoneRegex.test(phone)) {
          errors.phoneNumbers = 'Invalid phone number';
        }
      });
    }
    if (!editFields.dob) errors.dob = 'Date of Birth is required';
    if (!editFields.medium) errors.medium = 'Medium is required';
    if (!editFields.grade.length) errors.grade = 'At least one Grade is required';
    if (!editFields.subject) errors.subject = 'Subject is required';
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
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`http://localhost:8085/api/v1/teacher/update/${teacherId}`, editFields);
        setTeacherDetails(response.data);
        setIsEditing(false);
        Swal.fire(
          'Saved!',
          'Your changes have been saved.',
          'success'
        );
      } catch (error) {
        console.error('Error updating teacher information', error);
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

  const handleArrayInputChange = (e, index, field) => {
    const { value } = e.target;
    const updatedArray = [...editFields[field]];
    updatedArray[index] = value;
    setEditFields({
      ...editFields,
      [field]: updatedArray,
    });
  };

  const addPhoneNumber = () => {
    setEditFields({
      ...editFields,
      phoneNumbers: [...editFields.phoneNumbers, ''],
    });
  };

  const deletePhoneNumber = (index) => {
    const updatedPhoneNumbers = [...editFields.phoneNumbers];
    updatedPhoneNumbers.splice(index, 1);
    setEditFields({
      ...editFields,
      phoneNumbers: updatedPhoneNumbers,
    });
  };

  const addWorkingPlace = () => {
    setEditFields({
      ...editFields,
      workingPlaces: [...editFields.workingPlaces, ''],
    });
  };

  const deleteWorkingPlace = (index) => {
    const updatedWorkingPlaces = [...editFields.workingPlaces];
    updatedWorkingPlaces.splice(index, 1);
    setEditFields({
      ...editFields,
      workingPlaces: updatedWorkingPlaces,
    });
  };

  const handleGradeCheckboxChange = (e, grade) => {
    const isChecked = e.target.checked;
    let updatedGrades;

    if (isChecked) {
      updatedGrades = [...editFields.grade, grade];
    } else {
      updatedGrades = editFields.grade.filter((g) => g !== grade);
    }

    setEditFields({
      ...editFields,
      grade: updatedGrades,
    });
  };

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={teacherDetails.gender === "Male" ? TeacherMale : TeacherFemale}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                <p style={{marginTop:10}} className="text-muted mb-1">{teacherDetails.teacherid}</p>
              </MDBCardBody>
            </MDBCard>
            <PasswordChange/>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                {[
                  { label: 'Full Name', value: 'teachername' },
                  { label: 'Email', value: 'email' },
                  { label: 'Address', value: 'address' },
                  { label: 'Subject', value: 'subject' },
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
                          <MDBCardText className="text-muted">{teacherDetails[field.value]}</MDBCardText>
                        )}
                      </MDBCol>
                    </MDBRow>
                    <hr />
                  </div>
                ))}
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone Numbers</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <>
                        {editFields.phoneNumbers.map((phone, index) => (
                          <div key={index} className="mb-2">
                            <input
                              type="text"
                              className="form-control"
                              name={`phoneNumber-${index}`}
                              value={phone || ''}
                              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}  maxLength="10"
                              onChange={(e) => handleArrayInputChange(e, index, 'phoneNumbers')}
                            />
                            {errors.phoneNumbers && (
                              <div className="text-danger">{errors.phoneNumbers}</div>
                            )}
                            <MDBBtn
                              size="sm"
                              color="danger"
                              style={{marginTop:10,backgroundColor:"#d9544f"}}
                              onClick={() => deletePhoneNumber(index)}
                            >
                              Delete
                            </MDBBtn>
                          </div>
                        ))}
                        <MDBBtn style={{backgroundColor:"#007bff"}} onClick={addPhoneNumber}>Add Phone Number</MDBBtn>
                      </>
                    ) : (
                      teacherDetails.phoneNumbers && teacherDetails.phoneNumbers.map((phone, index) => (
                        <div key={index} className="mb-2">
                          <MDBCardText className="text-muted">{phone}</MDBCardText>
                        </div>
                      ))
                    )}
                    {errors.phoneNumbers && (
                      <div className="text-danger">{errors.phoneNumbers}</div>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Working Places</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <>
                        {editFields.workingPlaces.map((place, index) => (
                          <div key={index} className="mb-2">
                            <input
                              type="text"
                              className="form-control"
                              name={`workingPlace-${index}`}
                              value={place || ''}
                              onChange={(e) => handleArrayInputChange(e, index, 'workingPlaces')}
                            />
                            {errors.workingPlaces && (
                              <div className="text-danger">{errors.workingPlaces}</div>
                            )}
                            <MDBBtn
                              size="sm"
                              color="danger"
                              style={{marginTop:10,backgroundColor:"#d9544f"}}
                              onClick={() => deleteWorkingPlace(index)}
                            >
                              Delete
                            </MDBBtn>
                          </div>
                        ))}
                        <MDBBtn style={{backgroundColor:"#007bff"}} onClick={addWorkingPlace}>Add Working Place</MDBBtn>
                      </>
                    ) : (
                      teacherDetails.workingPlaces && teacherDetails.workingPlaces.map((place, index) => (
                        <div key={index} className="mb-2">
                          <MDBCardText className="text-muted">{place}</MDBCardText>
                        </div>
                      ))
                    )}
                    {errors.workingPlaces && (
                      <div className="text-danger">{errors.workingPlaces}</div>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
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
                      <MDBCardText className="text-muted">{teacherDetails.dob}</MDBCardText>
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
                      <MDBCardText className="text-muted">{teacherDetails.gender}</MDBCardText>
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
                      <MDBCardText className="text-muted">{teacherDetails.medium}</MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Grade</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <>
                        <MDBCheckbox
                          id="al"
                          name="grade-al"
                          label="A/L"
                          value="A/L"
                          checked={editFields.grade.includes('A/L')}
                          onChange={(e) => handleGradeCheckboxChange(e, 'A/L')}
                        />
                        <MDBCheckbox
                          id="ol"
                          name="grade-ol"
                          label="O/L"
                          value="O/L"
                          checked={editFields.grade.includes('O/L')}
                          onChange={(e) => handleGradeCheckboxChange(e, 'O/L')}
                        />
                        {errors.grade && (
                          <div className="text-danger">{errors.grade}</div>
                        )}
                      </>
                    ) : (
                      teacherDetails.grade && teacherDetails.grade.map((grd, index) => (
                        <MDBCardText key={index} className="text-muted">{grd}</MDBCardText>
                      ))
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Register Date</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{teacherDetails.registrationdate}</MDBCardText>
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
