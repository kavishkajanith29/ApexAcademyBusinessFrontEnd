import { Link } from "react-router-dom";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AreaCards = () => {

  const [enrollments, setEnrollments] = useState([]);
  const [userId, setUserId] = useState('');
  const teacherId = localStorage.getItem('teacherId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/subject/all`);
        // setEnrollments(response.data);
         console.log(response.data)
        console.log("Here")
         const filteredEnrollments = response.data.filter(enrollment => 
           enrollment.teacher.teacherid === teacherId
         );
         setEnrollments(filteredEnrollments);
         console.log(filteredEnrollments);
        console.log("Here11")
      } catch (error) {
        console.error('Error fetching enrollments', error);
      }
    };

    fetchEnrollments();
  }, [teacherId]);

 

  

  return (
    <section className="content-area-cards">
    {enrollments.map((enrollment) => (
      <Link 
      to={`/teacher/class/${enrollment.subjectid}`} 
      key={enrollment.subjectid}
    >
        
        <AreaCard
          colors={["#e4e8ef", "#475be8"]} // You can customize colors based on the class or status
          //percentFillValue={Math.random() * 100} // Replace with actual data if available
          cardInfo={{
            title: `${enrollment.subjectname}`,
            //value: `${enrollment.subject.subjectid}`,
            
            text: `${enrollment.subjectid}`,
            text1: `${enrollment.day} ${enrollment.timeRange}`,
          }}
        />
      </Link>
    ))}
  </section>
  );
};

export default AreaCards;
