import React, { useState } from "react";
import './TableCard.css';

const TableCard = ({ table, onCombine, onDragStart }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e) => {
    onDragStart(table);
    setDragging(true);
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    e.target.style.opacity = "1";
  };

  return (
    <div
      className={`table-card ${dragging ? "dragging" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => onCombine(table)} // Trigger table click
    >
      <div className="table-card-body">
        <h5>{table.name || `Table ${table.id}`}</h5>
        <p>Status: {table.status}</p>
        <p>{table.customers} Customers</p>
        <p>Employee: {table.employee}</p>
      </div>
    </div>
  );
};

export default TableCard;
