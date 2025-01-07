/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "./DishCard.css";

const DishCard = ({ dish, onAddToOrder }) => {
  console.log('Dish description:', dish.description);
  if (!dish) {
    console.error("Dish object is missing!");
    return <div className="compact-card">Dish data is unavailable</div>;
  }

  return (
    <div className="compact-card" onClick={() => onAddToOrder && onAddToOrder(dish)}>
      <div className="compact-card-image">
        <img
          src={dish.image || "placeholder.png"} // Default image if missing
          alt={dish.title || "Dish Image"}
          className="compact-card-img"
        />
      </div>
      <div className="compact-card-body">
        <h5 className="compact-card-title">{dish.title || "Unknown Dish"}</h5>
        <p className="compact-card-price">{dish.price || "Price Not Available"}</p>
        <p className="compact-card-category">{dish.category || "No Category"}</p>
        <p className="compact-card-description"> {dish.description || "No Description Available"}</p>
      </div>
    </div>
  );
};

export default DishCard;
