import React from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import Student from '../../../assets/images/student.png'
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
 
} from 'mdb-react-ui-kit';

export default function ProfilePage() {

  const [enrollments, setEnrollments] = useState([]);
  const [userId, setUserId] = useState('');
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/student/${studentId}`);
        setEnrollments(response.data);
        console.log(response.data)
        console.log("Here")
        
      } catch (error) {
        console.error('Error fetching enrollments', error);
      }
    };

    fetchEnrollments();
  }, [studentId]);

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">
       

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={Student}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                <p className="text-muted mb-1">{enrollments.studentname}</p>
                <p className="text-muted mb-4">Male</p>
               
              </MDBCardBody>
            </MDBCard>

          
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.studentname}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Address</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.address}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Mobile</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.phonenumber}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Date of Birth</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.dob}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Parents/Legal Guardian Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.parentsname}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Medium</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.medium}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Grade</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.grade}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                {/* <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Subject</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">English,Maths</MDBCardText>
                  </MDBCol>
                </MDBRow> */}
                
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Register Date</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{enrollments.registrationdate}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
              </MDBCardBody>
            </MDBCard>

            
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}