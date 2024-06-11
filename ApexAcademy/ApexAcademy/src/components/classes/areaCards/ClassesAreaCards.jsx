import React, { useState, useEffect } from "react";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import axios from "axios";

const ClassesAreaCards = () => {
  const [cards, setCards] = useState([
    { id: 1, title: "O/L English Medium Class Fees", value: "" },
    { id: 2, title: "O/L Sinhala Medium Class Fees", value: "" },
    { id: 3, title: "A/L English Medium Class Fees", value: "" },
    { id: 4, title: "A/L Sinhala Medium Class Fees", value: "" },
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
      .get("http://localhost:8085/classfee/all")
      .then((response) => {
        const updatedCards = cards.map((card) => {
          const updatedCard = response.data.find((data) => {
            const mediumMatch = data.medium.toUpperCase() === card.title.split(" ")[1].toUpperCase();
            const gradeMatch = data.grade.toUpperCase() === card.title.split(" ")[0].toUpperCase();
            return mediumMatch && gradeMatch;
          });
          return updatedCard ? { ...card, value: updatedCard.fee } : card;
        });
        setCards(updatedCards);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const updateValueInDatabase = (id, newFee) => {
    let medium = "";
    let grade = "";
    let classIdPrefix ="";

    switch (id) {
      case 1:
        medium = "ENGLISH";
        grade = "O/L";
        classIdPrefix = "OL";
        break;
      case 2:
        medium = "SINHALA";
        grade = "O/L";
        classIdPrefix = "OL";
        break;
      case 3:
        medium = "ENGLISH";
        grade = "A/L";
        classIdPrefix = "AL";
        break;
      case 4:
        medium = "SINHALA";
        grade = "A/L";
        classIdPrefix = "AL";
        break;
      default:
        console.error(`Invalid id: ${id}`);
        return;
    }
    
    axios
    .put(`http://localhost:8085/classfee/update/${medium}`, {
        grade: grade,
        newFee: newFee
    })
    .then((response) => {
        console.log("Value updated successfully:", response.data);
    })
    .catch((error) => {
        console.error("Error updating value:", error);
    });
    
    axios
    .put(`http://localhost:8085/api/v1/subject/update-fees?medium=${medium}&classIdPrefix=${classIdPrefix}&newClassFee=${newFee}`)
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('There was an error updating the class fees!', error);
    });
};

  return (
    <section className="content-area-card">
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
