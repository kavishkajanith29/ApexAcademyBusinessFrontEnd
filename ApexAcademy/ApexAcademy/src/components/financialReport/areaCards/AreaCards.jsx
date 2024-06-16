import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { useEffect, useState } from "react";

const AreaCards = () => {
  const [studentCount, setStudentCount] = useState(null);
  const [teacherCount, setTeacherCount] = useState(null);
  const [classCount, setClassCount] = useState(null);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch("http://localhost:8085/api/v1/student/count");
        if (response.ok) {
          const data = await response.json();
          setStudentCount(data);
        } else {
          console.error("Failed to fetch student count");
        }
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };

    const fetchTeacherCount = async () => {
      try {
        const response = await fetch("http://localhost:8085/api/v1/teacher/count");
        if (response.ok) {
          const data = await response.json();
          setTeacherCount(data);
        } else {
          console.error("Failed to fetch teacher count");
        }
      } catch (error) {
        console.error("Error fetching teacher count:", error);
      }
    };

    const fetchClassCount = async () => {
      try {
        const response = await fetch("http://localhost:8085/api/v1/subject/count");
        if (response.ok) {
          const data = await response.json();
          setClassCount(data);
        } else {
          console.error("Failed to fetch class count");
        }
      } catch (error) {
        console.error("Error fetching class count:", error);
      }
    };

    fetchStudentCount();
    fetchTeacherCount();
    fetchClassCount();
  }, []);

  return (
    <section className="content-area-cards">
      <AreaCard
        cardInfo={{
          title: "Total Number of Students Registered",
          value: `${studentCount ? studentCount.toLocaleString() : "Loading..."}`,
          text: "",
        }}
      />
      <AreaCard
        cardInfo={{
          title: "Total Number of Teachers Registered",
          value: `${teacherCount ? teacherCount.toLocaleString() : "Loading..."}`,
          text: "",
        }}
      />
      <AreaCard
        cardInfo={{
          title: "Total Number of Classes Registered",
          value: `${classCount ? classCount.toLocaleString() : "Loading..."}`,
          text: "",
        }}
      />
    </section>
  );
};

export default AreaCards;
