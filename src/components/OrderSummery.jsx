import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSummery.css';

const OrderSummary = ({ table, orders, setOrders }) => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderType, setOrderType] = useState('Dining'); // Default to Dining

  useEffect(() => {
    if (table && !orderNumber) {
      setOrderNumber(`${table.number}-001`);
    }
  }, [table, orderNumber]);

  const subtotal = orders.reduce((total, order) => total + order.price * order.qty, 0).toFixed(2);

  const handleNoteChange = (id, note) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, note } : order)));
  };

  const handleQtyChange = (id, value) => {
    const newQty = parseInt(value) || 0;
    if (newQty >= 0) {
      setOrders(orders.map((order) => 
        order.id === id ? { ...order, qty: newQty } : order
      ));
    }
  };

  const handleDeleteItem = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const handleAddBill = async () => {
    try {
      // Prepare the order data
      const orderData = {
        tableNumber: table.number,
        orderType: orderType,
        tableAssistant: table.employee,
        numberOfCustomers: table.customers,
        orderItems: orders.map(order => ({
          itemName: order.item,
          quantity: order.qty,
          unitPrice: order.price,
          totalPrice: order.price * order.qty,
          specialNote: order.note
        })),
        totalAmount: parseFloat(subtotal),
        orderStatus: "PENDING"
      };

      // Make the API call
      const response = await fetch('http://localhost:8080/api/orders/addorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to add order');
      }

      // Navigate after successful order
      navigate('/');
    } catch (error) {
      console.error('Error adding order:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="order-summary">
      <div className="order-header-section">
        <h2 className="order-title">Order #{orderNumber}</h2>
        
        <div className="order-type-selector">
          <select 
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="order-type-select"
          >
            <option value="Dining">Dining</option>
            <option value="Take Away">Take Away</option>
          </select>
        </div>

        <div className="table-info-compact">
          {table ? (
            <div className="table-details-row">
              <div className="table-detail-pair">
                <span className="detail-label">Table:</span>
                <span className="detail-value">{table.number}</span>
              </div>
              <div className="table-detail-pair">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{table.status}</span>
              </div>
              <div className="table-detail-pair">
                <span className="detail-label">Employee:</span>
                <span className="detail-value">{table.employee}</span>
              </div>
              <div className="table-detail-pair">
                <span className="detail-label">Customers:</span>
                <span className="detail-value">{table.customers}</span>
              </div>
            </div>
          ) : (
            <p className="no-table">No table selected</p>
          )}
        </div>
      </div>

      <div className="orders-section">
        <div className="order-list-header">
          <span className="header-item">Item</span>
          <span className="header-qty">Qty</span>
          <span className="header-price">Price</span>
        </div>
        
        <div className="order-list-expanded">
          {orders.map((order) => (
            <div key={order.id} className="order-item-card">
              <div className="order-main-details">
                <span className="item-name">{order.item}</span>
                <input
                  type="number"
                  min="0"
                  value={order.qty}
                  onChange={(e) => handleQtyChange(order.id, e.target.value)}
                  className="qty-input"
                  aria-label={`Quantity for ${order.item}`}
                />
                <span className="item-price">${(order.price * order.qty).toFixed(2)}</span>
              </div>
              
              <div className="order-item-note">
                <input
                  type="text"
                  value={order.note || ''}
                  onChange={(e) => handleNoteChange(order.id, e.target.value)}
                  placeholder="Add note"
                  className="note-input"
                  aria-label={`Note for ${order.item}`}
                />
                <button
                  className="delete-button"
                  onClick={() => handleDeleteItem(order.id)}
                  aria-label={`Delete ${order.item}`}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-footer">
        <div className="subtotal-section">
          <span className="subtotal-label">Subtotal:</span>
          <span className="subtotal-amount">${subtotal}</span>
        </div>
        <div className="action-buttons">
          <button 
            className="add-bill-button"
            onClick={handleAddBill}
            disabled={orders.length === 0}
          >
            Add Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;