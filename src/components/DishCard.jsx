import React from "react";
import "./DishCard.css";

const DishCard = ({ dish, onAddToOrder }) => {
  return (
    <div className="compact-card" onClick={() => onAddToOrder(dish)}>
      <div className="compact-card-image">
        <img
          src={dish.image || "placeholder.png"} // Handle missing image
          alt={dish.title}
          className="compact-card-img"
        />
      </div>
      <div className="compact-card-body">
        <h5 className="compact-card-title">{dish.title}</h5>
        <p className="compact-card-price">{dish.price}</p>
      </div>
    </div>
  );
};

export default DishCard;
