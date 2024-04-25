import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
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
          title: "This Month New Students",
          value: "05",
          //text: "Available to payout",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        //percentFillValue={40}
        cardInfo={{
          title: "Number of Student",
          value: "123",
          //text: "Available to payout",
        }}
      />
    </section>
  );
};

export default AreaCards;
