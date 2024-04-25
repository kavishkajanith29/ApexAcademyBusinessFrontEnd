import { Link } from "react-router-dom";
import AreaCard from "./AreaCard";
import "./AreaCard.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <Link to="/student/class">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        //percentFillValue={80}
        cardInfo={{
          title: "Grade 6 - English",
          value: " ",
          text: "Mr: Suranga ",
        }}
      /> </Link>
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "Grade 6 - Science",
          value: "",
          text: "Mr: Kamal",
        }}
      />

    <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "Grade 6 - Tamil",
          value: "",
          text: "Mr: Kasun",
        }}
      />
      
    </section>
  );
};

export default AreaCards;
