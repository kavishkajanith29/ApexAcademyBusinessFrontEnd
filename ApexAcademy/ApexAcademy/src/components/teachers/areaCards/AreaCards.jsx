import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard
        cardInfo={{
          title: "Total Number of Teachers Registered",
          value: "24",
        }}
      />
      <AreaCard
        cardInfo={{
          title: "Total Number of Classes Registered",
          value: "41",
        }}
      />
    </section>
  );
};

export default AreaCards;
