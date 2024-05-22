import React, { useState, useEffect } from "react";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import axios from "axios";

const ClassesAreaCards = () => {
  const [cards, setCards] = useState([
    { id: 1, title: "Total Number of Classes Registered", value: "Loading" },
    { id: 2, title: "English Medium Class Fees", value: "" },
    { id: 3, title: "Sinhala Medium Class Fees", value: "" },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = (id, newValue) => {
    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, value: newValue } : card
    );
    setCards(updatedCards);
    updateValueInDatabase(id, newValue);
  };

  const fetchData = () => {
    axios
      .all([
        axios.get("http://localhost:8085/classfee/all"),
        axios.get("http://localhost:8085/api/v1/subject/count"),
      ])
      .then(
        axios.spread((classFeesResponse, numberOfClassesResponse) => {
          const updatedCards = cards.map((card) => {
            if (
              card.title === "English Medium Class Fees" ||
              card.title === "Sinhala Medium Class Fees"
            ) {
              const updatedCard = classFeesResponse.data.find(
                (data) =>
                  data.medium.toUpperCase() ===
                  card.title.split(" ")[0].toUpperCase()
              );
              if (updatedCard) {
                return { ...card, value: updatedCard.fee };
              }
            } else if (card.title === "Total Number of Classes Registered") {
              return { ...card, value: numberOfClassesResponse.data };
            }
            return card;
          });
          setCards(updatedCards);
        })
      )
      .catch((errors) => {
        console.error("Error fetching data:", errors);
      });
  };

  const updateValueInDatabase = (id, newFee) => {
    let endpoint = "";
    if (id === 2) {
      endpoint = "ENGLISH";
    } else if (id === 3) {
      endpoint = "SINHALA";
    } else {
      console.error(`Invalid id: ${id}`);
      return;
    }

    axios
      .put(`http://localhost:8085/classfee/update/${endpoint}?newFee=${newFee}`)
      .then((response) => {
        console.log("Value updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating value:", error);
      });

    axios
      .put(
        `http://localhost:8085/api/v1/subject/update-fees?medium=${endpoint}&newClassFee=${newFee}`
      )
      .then((response) => {
        console.log(
          "Additional value updated successfully:",
          response.data
        );
      })
      .catch((error) => {
        console.error("Error updating additional value:", error);
      });
  };

  return (
    <section className="content-area-cards">
      {cards.map((card) => (
        <AreaCard
          key={card.id}
          cardInfo={card}
          onSave={(newValue) => handleSave(card.id, newValue)}
        />
      ))}
    </section>
  );
};

export default ClassesAreaCards;
