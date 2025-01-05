import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Order.css';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { table } = location.state || {};

  const [orders, setOrders] = useState([]);

  // Calculate subtotal
  const subtotal = orders.reduce((total, order) => total + order.price * order.qty, 0).toFixed(2);

  // Handle adding to order
  const handleAddToOrder = (dish) => {
    // Check if the item is already in the order list
    const existingOrder = orders.find((order) => order.item === dish.title);

    if (existingOrder) {
      // If it exists, increment the quantity
      setOrders(
        orders.map((order) =>
          order.item === dish.title ? { ...order, qty: order.qty + 1 } : order
        )
      );
    } else {
      // Add a new order
      setOrders([
        ...orders,
        {
          id: new Date().getTime(), // Generate a unique ID using timestamp
          item: dish.title,
          qty: 1,
          price: parseFloat(dish.price.replace('$', '')), // Convert price to a number (ensure currency symbol is removed)
          note: '',
        },
      ]);
    }
  };

  // Handle note change
  const handleNoteChange = (id, note) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, note } : order)));
  };

  // Handle delete item
  const handleDeleteItem = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  // Handle navigation to BillingPage
  const handlePaymentNavigation = () => {
    navigate('/billing', { state: { table, orders, subtotal } });
  };

  return (
    <div className="order-summary">
      <h5 className="order-title">Order #34562</h5>

      {/* Table Info */}
      <div className="table-info">
        {table ? (
          <>
            <p><strong>Table Name:</strong> {table.name}</p>
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
              <input
                type="text"
                value={order.note}
                onChange={(e) => handleNoteChange(order.id, e.target.value)}
                placeholder="Add a note"
                className="note-input"
              />
              <button
                className="delete-btn"
                onClick={() => handleDeleteItem(order.id)}
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal and Continue to Payment */}
      <div className="order-footer">
        <div className="subtotal">
          <span>Subtotal:</span>
          <span>{`$${subtotal}`}</span>
          <button className="btn-primary" onClick={handlePaymentNavigation}>
            <i className="bi bi-credit-card" style={{ marginRight: '8px' }}></i>
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
