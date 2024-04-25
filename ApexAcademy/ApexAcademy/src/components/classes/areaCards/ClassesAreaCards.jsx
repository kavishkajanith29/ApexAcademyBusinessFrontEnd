import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const ClassesAreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        //percentFillValue={80}
        cardInfo={{
          title: "Total Number of Classes Registered",
          value: "24",
          text: " ",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "English Medium Class Fees",
          value: "Rs. 1500.00",
          //text: "Available to payout",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "Sinhala Medium Class Fees",
          value: "Rs. 1200.00",
          //text: "Available to payout",
        }}
      />
    </section>
  );
};

export default ClassesAreaCards;
