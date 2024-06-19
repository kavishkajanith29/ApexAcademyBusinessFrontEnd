import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 

const AreaCards = () => {

  const [studentCount, setStudentCount] = useState(null);
  const [monthlyStudentCount, setMonthlyStudentCount] = useState(null);
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch(`http://localhost:8085/api/v1/enrollment/subject/${id}`);
        if (response.ok) {
          const data = await response.json();
          setStudentCount(data);
          console.log(data);
          const uniqueStudentIds = new Set(data.map(data => data.enrollmentId));
          setStudentCount(uniqueStudentIds.size);
          console.log(uniqueStudentIds.size);
          console.log("herecount");
                   // Filter students who registered in the current month
                   const currentMonth = new Date().getMonth();
                   const currentYear = new Date().getFullYear();
                   const monthlyRegisteredStudents = data.filter(student => {
                    try {
                      const registrationDate = new Date(student.registrationdate); // assuming there is a registrationDate field
                      if (isNaN(registrationDate)) {
                        throw new Error(`Invalid date format for registrationDate: ${student.registrationdate}`);
                      }
                      console.log("Registration Date: ", registrationDate);
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
                   console.log("Monthly Registered Students: ", monthlyRegisteredStudents.length);
         
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
          value: "Rs.12 000.00",
          text: "From 120 Students.",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "This Month New Students(Filter Student)",
          value: `${monthlyStudentCount ? monthlyStudentCount.toLocaleString() : "Loading..."}`,
          //text: "Available to payout",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        //percentFillValue={40}
        cardInfo={{
          title: "Number of Student",
          value: `${studentCount ? studentCount.toLocaleString() : "Loading..."}`,
          //text: "Available to payout",
        }}
      />
    </section>
  );
};

export default AreaCards;
