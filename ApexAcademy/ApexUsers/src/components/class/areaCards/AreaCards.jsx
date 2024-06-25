import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import {useParams } from "react-router-dom"; 

const AreaCards = () => {
  const [studentount, setStudentCount] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const { id } = useParams(); 

  useEffect(() => {
    // Fetch count of subjects
    axios.get(`http://localhost:8085/api/v1/enrollment/recent`)
      .then(response => {
        const filteredStudentsEnrollments = response.data.filter(enrollments =>
          enrollments.subject.subjectid === id
        );
        setStudentCount(filteredStudentsEnrollments.length);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });

    // Fetch count of enrollments
    axios.get(`http://localhost:8085/api/v1/enrollment/recent`)
      .then(response => {
        // Filter enrollments by current year and month and teacherId
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const filteredEnrollments = response.data.filter(enrollment =>
          new Date(enrollment.enrollmentDate).getFullYear() === currentYear &&
          new Date(enrollment.enrollmentDate).getMonth() + 1 === currentMonth &&
          enrollment.subject.subjectid === id
        );
        setEnrollmentCount(filteredEnrollments.length);
      })
      .catch(error => {
        console.error('Error fetching enrollments:', error);
      });

    // Calculate total income
    axios.get(`http://localhost:8085/api/v1/fees/all`)
      .then(response => {
        // Filter fees by current year and month and teacherId
        const currentYear = new Date().getFullYear();
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Format month as two digits
        const filteredFees = response.data.filter(fee =>
          fee.month === `${currentYear}-${currentMonth}` &&
          fee.enrollment.subject.subjectid === id
        );
        // Calculate total income
        const total = filteredFees.reduce((acc, fee) => acc + parseFloat(fee.amount), 0);
        setTotalIncome(total);
      })
      .catch(error => {
        console.error('Error fetching fees:', error);
      });

  }, []);

  return (
    <section className="content-area-cards">
      <AreaCard
        cardInfo={{
          title: "This Month From Class Fees ",
          value: `Rs. ${(totalIncome * 0.8).toFixed(2)}`,
        }}
      />
      <AreaCard
        cardInfo={{
          title: "This Month New Students",
          value: enrollmentCount,
        }}
      />
      <AreaCard
        cardInfo={{
          title: "Number of Students",
          value: studentount,
        }}
      />
    </section>
  );
};

export default AreaCards;
