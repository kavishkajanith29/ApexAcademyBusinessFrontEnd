import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        //percentFillValue={80}
        cardInfo={{
          title: "This Month Class Fees",
          value: "Rs.150 0000.00",
          text: "From 1200 Students.",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        //percentFillValue={50}
        cardInfo={{
          title: "This Month New Students",
          value: "120",
          //text: "Available to payout",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        //percentFillValue={40}
        cardInfo={{
          title: "This Month Revenue From Class Fees",
          value: "Rs.30 0000.00",
          //text: "Available to payout",
        }}
      />
    </section>
  );
};

export default AreaCards;

