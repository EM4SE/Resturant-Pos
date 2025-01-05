import './BillsPage.css'; // Import the styles
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BillsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { table } = location.state || {}; // Extract table data from state, no bill data needed for now

  // If no table is selected, show a fallback message
  if (!table) {
    return <div>No table selected</div>;
  }

  // Function to handle navigation to the FoodOrder page to add a new bill
  const handleAddNewBill = () => {
    navigate('/food-order', { state: { table } }); // Pass the table data for reference to the food order page
  };

  return (
    <div className="bills-page">
      <h2>Bill Details for Table {table.number}</h2>

      {/* Button to Add New Bill */}
      <button className="add-bill-button" onClick={handleAddNewBill}>
        Add New Bill
      </button>

      {/* Show a message indicating no bills yet */}
      <p>No bills available for this table. Please add a new bill.</p>
    </div>
  );
};

export default BillsPage;
