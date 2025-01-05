import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSummery.css';

const OrderSummary = ({ table, orders, setOrders, updateBills }) => {
  const navigate = useNavigate();

  // Create a static order number that stays the same throughout the session
  const [orderNumber, setOrderNumber] = useState(null);

  // Initialize the order number when the table is first selected
  useEffect(() => {
    if (table && !orderNumber) {
      setOrderNumber(`${table.number}-001`); // Using table number and static suffix
    }
  }, [table, orderNumber]);

  // Calculate the subtotal
  const subtotal = orders.reduce((total, order) => total + order.price * order.qty, 0).toFixed(2);

  // Handle note change
  const handleNoteChange = (id, note) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, note } : order)));
  };

  // Handle delete item
  const handleDeleteItem = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  // Redirect to Bills page and add a new bill each time
  const handleProceedToBills = () => {
    try {
      // Create a new bill for the table with the current orders
      const newBill = {
        orderNumber: orderNumber, // Use the static order number
        amount: parseFloat(subtotal), // Use the subtotal as the bill amount
        orders, // Store the orders in the bill
      };

      // Update the bills associated with the table (assuming `updateBills` is a prop)
      updateBills((prevBills) => [
        ...prevBills,
        { ...newBill, tableId: table.id },
      ]);

      // Navigate to the Bills page, passing the table
      if (table) {
        navigate('/bills', { state: { table } });
      } else {
        throw new Error("Table data is missing.");
      }
    } catch (error) {
      // Catch any errors and log them
      console.error("Error while navigating to BillsPage:", error);
      alert("An error occurred while navigating to the Bills page. Please try again.");
    }
  };

  return (
    <div className="order-summary">
      <h5 className="order-title">Order #{orderNumber}</h5> {/* Static order number */}

      {/* Table Info */}
      <div className="table-info">
        {table ? (
          <>
            <p><strong>Table Number:</strong> {table.number}</p> {/* Display the table number */}
            <p><strong>Status:</strong> {table.status}</p>
            <p><strong>Employee:</strong> {table.employee}</p>
            <p><strong>Customers:</strong> {table.customers}</p>
          </>
        ) : (
          <p>No table selected</p>
        )}
      </div>

      {/* Order Details */}
      <div className="order-header">
        <span className="header-item">Item</span>
        <span className="header-qty">Qty</span>
        <span className="header-price">Price</span>
      </div>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-details">
              <span className="order-item">{order.item}</span>
              <span className="order-qty">{order.qty}</span>
              <span className="order-price">${(order.price * order.qty).toFixed(2)}</span>
            </div>

            {/* Editable Note Section */}
            <div className="order-note">
              <label htmlFor={`note-${order.id}`} className="visually-hidden">
                Add a note for {order.item}
              </label>
              <input
                id={`note-${order.id}`}
                type="text"
                value={order.note || ''}
                onChange={(e) => handleNoteChange(order.id, e.target.value)}
                placeholder="Add a note"
                className="note-input"
              />
              <button
                className="delete-btn"
                aria-label={`Delete ${order.item}`}
                onClick={() => handleDeleteItem(order.id)}
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal and Continue to Bills */}
      <div className="order-footer">
        <div className="subtotal">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
          <button className="btn-primary" onClick={handleProceedToBills}>
            Continue to Bills
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
