import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { useEffect, useState } from "react";

const AreaCards = () => {
  const [studentCount, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch("http://localhost:8085/api/v1/student/count");
        if (response.ok) {
          const data = await response.json();
          setStudent(data);
        } else {
          console.error("Failed to fetch user count");
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchStudentCount();
  }, []);

  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        cardInfo={{
          title: "Total Number of Students Registered",
          value: `${studentCount ? studentCount.toLocaleString() : "Loading..."}`,
          text: "",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "Total Number of Teachers Registered",
          value: "24",
          //text: "Available to payout",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        //percentFillValue={40}
        cardInfo={{
          title: "Total Number of Class Registered",
          value: "41",
          //text: "Available to payout",
        }}
      />
    </section>
  );
};

export default AreaCards;
