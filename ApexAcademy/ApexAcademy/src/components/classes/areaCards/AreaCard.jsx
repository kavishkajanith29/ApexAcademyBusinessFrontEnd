import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const AreaCard = ({ cardInfo, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(cardInfo.value); 
  }, [cardInfo.value]);

  const handleEditClick = () => {
    setIsEditing(true);
    setValue(cardInfo.value);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setValue(cardInfo.value);
  };

  const handleSaveClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to update ${cardInfo.title} to Rs. ${value}.00?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        onSave(value);
        setIsEditing(false);
        Swal.fire("Updated!", "Your value has been updated.", "success");
      }
    });
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        {isEditing ? (
          <div className="info-value">
            Rs.{" "}
            <input
              type="text"
              className="info-value-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        ) : (
          <div className="info-value">
            {cardInfo.title !== "Total Number of Classes Registered"
              ? `Rs.${cardInfo.value}.00`
              : `${cardInfo.value}`}
          </div>
        )}
        {cardInfo.title !== "Total Number of Classes Registered" && (
          <div className="buttons">
            {isEditing ? (
              <>
                <button className="btn btn-update" onClick={handleSaveClick}>
                  Update
                </button>
                <button
                  className="btn btn-cancel"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-edit" onClick={handleEditClick}>
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

AreaCard.propTypes = {
  cardInfo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AreaCard;
