import PropTypes from "prop-types";

const AreaCard = ({cardInfo }) => {
  return (
    <div className="area-card-dashbord">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{cardInfo.value}</div>
        <p className="info-text">{cardInfo.text}</p>
      </div>
    </div>
  );
};

export default AreaCard;

AreaCard.propTypes = {
  cardInfo: PropTypes.object.isRequired,
};
