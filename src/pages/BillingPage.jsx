import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BillingPage.css';

const BillingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { table } = location.state || {}; // Retrieve table info
  const [bills, setBills] = useState([]); // Manage multiple bills
  const [newBill, setNewBill] = useState({ id: Date.now(), items: [], orderNumber: 1 }); // Temporary new bill
  const [currentBillId, setCurrentBillId] = useState(null);

  // Calculate the total price of a specific bill
  const calculateTotal = (bill) => {
    return bill.items.reduce((total, item) => total + item.price * item.qty, 0).toFixed(2);
  };

  // Add a new item to the current bill
  const addItemToBill = (item) => {
    setNewBill((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
  };

  // Save the current bill and reset the new bill state
  const saveCurrentBill = () => {
    if (newBill.items.length === 0) return; // Avoid saving empty bills
    const newOrderNumber = bills.length + 1; // Increment order number for each new bill
    setBills((prev) => [
      ...prev,
      { ...newBill, orderNumber: newOrderNumber },
    ]);
    setNewBill({ id: Date.now(), items: [], orderNumber: newOrderNumber + 1 });
  };

  // Select a bill to view or edit
  const selectBill = (billId) => {
    setCurrentBillId(billId);
  };

  // Get the current bill by ID
  const getCurrentBill = () => {
    return bills.find((bill) => bill.id === currentBillId) || newBill;
  };

  // Navigate to the Food Order page to update an existing bill or create a new one
  const navigateToFoodOrder = (bill) => {
    navigate('/food-order', { state: { table, bill } });
  };

  return (
    <div className="billing-page-container">
      <div className="receipt-container">
        <div className="receipt-header">
          <h2>Restaurant Name</h2>
          <p>Address Line 1</p>
          <p>Address Line 2</p>
          <p>Phone: +1 234 567 890</p>
        </div>

        <div className="receipt-details">
          {table ? (
            <>
              <p><strong>Table Name:</strong> {table.name}</p>
              <p><strong>Employee:</strong> {table.employee}</p>
              <p><strong>Customers:</strong> {table.customers}</p>
            </>
          ) : (
            <p>No table information available</p>
          )}
        </div>

        <div className="receipt-line"></div>

        <div className="receipt-items">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentBill().items.length > 0 ? (
                getCurrentBill().items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No items in this bill</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="receipt-line"></div>

        <div className="receipt-footer">
          <p><strong>Subtotal:</strong> ${calculateTotal(getCurrentBill())}</p>
          <p><strong>Tax (10%):</strong> ${(calculateTotal(getCurrentBill()) * 0.1).toFixed(2)}</p>
          <p><strong>Total:</strong> ${(calculateTotal(getCurrentBill()) * 1.1).toFixed(2)}</p>
        </div>

        <div className="receipt-actions">
          <button onClick={saveCurrentBill}>Save Bill</button>
          <button onClick={() => navigateToFoodOrder(getCurrentBill())}>
            Update Existing Bill
          </button>
          <button
            onClick={() =>
              navigateToFoodOrder({ id: Date.now(), items: [], orderNumber: bills.length + 2 })
            }
          >
            Add Another Bill
          </button>
          {bills.map((bill) => (
            <button key={bill.id} onClick={() => selectBill(bill.id)}>
              View Bill #{bill.orderNumber}
            </button>
          ))}
        </div>

        <div className="add-item">
          <h3>Add Item</h3>
          <button
            onClick={() =>
              addItemToBill({
                name: 'New Item',
                qty: 1,
                price: 10,
              })
            }
          >
            Add Example Item
          </button>
        </div>

        <div className="receipt-thankyou">
          <p>Thank you for dining with us!</p>
          <p>Visit Again!</p>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
