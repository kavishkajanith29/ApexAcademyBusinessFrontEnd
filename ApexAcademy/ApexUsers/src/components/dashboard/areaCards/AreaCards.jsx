import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 


const AreaCards = () => {
  const [studentCount, setStudentCount] = useState(null);
  const [monthlyStudentCount, setMonthlyStudentCount] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch(`http://localhost:8085/api/v1/enrollment/recent`);
        if (response.ok) {
          const data = await response.json();
          //setStudentCount(data);
          //console.log(data);
          const filteredEnrollments = data.filter(enrollment => 
            enrollment.subject.teacher.teacherid === teacherId
          );
          setEnrollments(filteredEnrollments.length);
          console.log(filteredEnrollments);
          // Current month and year
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          // Filter students who registered in the current month
          const monthlyRegisteredStudents = filteredEnrollments.filter(student => {
            try {
              const registrationDate = new Date(student.enrollmentDate); // Ensure this field name matches the API response
              if (isNaN(registrationDate)) {
                throw new Error(`Invalid date format for registrationDate: ${student.registrationdate}`);
                const filteredEnrollments = data.filter(enrollment => 
                  enrollment.subject.teacher.teacherid === teacherId
                );
                
              }
              console.log("herecount1");
              return (
                registrationDate.getMonth() === currentMonth &&
                registrationDate.getFullYear() === currentYear
              );
            } catch (error) {
              console.error(error.message);
              return false; // Filter out students with invalid dates
            }
          });

            setMonthlyStudentCount(monthlyRegisteredStudents.length);
            console.log(monthlyRegisteredStudents);
            console.log("herecount3");
         
        } else {
          console.error("Failed to fetch student count");
        }
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };
    fetchStudentCount();
  }, []);
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        //percentFillValue={80}
        cardInfo={{
          title: "This Month Salary (Rs:1250*0.8)",
          value: "Rs.120 0000.00",
          text: "From 1200 Students.",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "This Month New Students",
          value: `${monthlyStudentCount ? monthlyStudentCount.toLocaleString() : "Loading..."}`,
          //text: "Available to payout",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        //percentFillValue={40}
        cardInfo={{
          title: "Number of Classes",
          value: `${enrollments ? enrollments.toLocaleString() : "Loading..."}`,
          //text: "Available to payout",
        }}
      />
    </section>
  );
};

export default AreaCards;
