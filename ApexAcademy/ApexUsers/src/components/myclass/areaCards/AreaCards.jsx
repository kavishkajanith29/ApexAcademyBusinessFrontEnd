import { Link } from "react-router-dom";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <Link to="/teacher/class" className="clslink">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        //percentFillValue={80}
        cardInfo={{
          title: "Grade 06 -English",
          value: " ",
          text: " ",
        }}
      />
      </Link>
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "Grade 07 -English",
          value: " ",
          //text: "Available to payout",
        }}
      />

<AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "Grade 08 -English",
          value: " ",
          //text: "Available to payout",
        }}
      />
    </section>
  );
};

export default AreaCards;
