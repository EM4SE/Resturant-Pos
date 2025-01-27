import React from 'react';
import './BillCard.css';

const BillCard = ({ bill, onAddFoodClick, onProceedToPayment, onCompletePayment }) => {
  return (
    <div className="bill-card">
      <button
        className="add-food-button"
        onClick={(e) => {
          e.stopPropagation();
          onAddFoodClick(bill);
        }}
      >
        +
      </button>
      <h5>Bill #{bill.number}</h5>
      <p>Amount: ${bill.amount.toFixed(2)}</p>
      {bill.date && <p>Date: {new Date(bill.date).toLocaleDateString()}</p>}
      {bill.customer && <p>Customer: {bill.customer}</p>}
      <p>Status: {bill.status}</p>
      <button
        className="proceed-payment-button"
        onClick={(e) => {
          e.stopPropagation();
          onProceedToPayment(bill);
        }}
      >
        Proceed to Payment
      </button>
      <button
        className="complete-payment-button"
        onClick={(e) => {
          e.stopPropagation();
          onCompletePayment(bill);
        }}
      >
        Complete
      </button>
    </div>
  );
};

export default BillCard;
