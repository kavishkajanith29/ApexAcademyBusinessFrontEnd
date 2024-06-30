import { Link } from "react-router-dom";
import AreaCard from "./AreaCard";
import "./AreaCard.scss";
import { useEffect, useState } from 'react';
import axios from 'axios';

const AreaCards = () => {

  const [enrollments, setEnrollments] = useState([]);
  const [userId, setUserId] = useState('');
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/enrollment/student/${studentId}`);
        setEnrollments(response.data);
        console.log(response.data)
        console.log("Here")
        //localStorage.setItem('subjectId',response.data);
        //console.log("Here11")
      } catch (error) {
        console.error('Error fetching enrollments', error);
      }
    };

    fetchEnrollments();
  }, [studentId]);


  

  return (
    <section className="content-area-cards">
    {enrollments.map((enrollment) => (
      <Link to={`/student/class/${enrollment.subject.subjectid}`} 
      key={enrollment.subjectid}>
        <AreaCard
          colors={["#e4e8ef", "#475be8"]} // You can customize colors based on the class or status
          //percentFillValue={Math.random() * 100} // Replace with actual data if available
          cardInfo={{
            title: `${enrollment.subject.subjectname}`,
            //value: `${enrollment.subject.subjectid}`,
            
            text: `${enrollment.subject.teacher.gender === 'Male' ? 'Mr' : 'Ms'}: ${enrollment.subject.teacher.teachername}`,
            text1: `${enrollment.subject.day} ${enrollment.subject.timeRange}`,
          }}
        />
      </Link>
    ))}
  </section>
  );
};

export default AreaCards;
