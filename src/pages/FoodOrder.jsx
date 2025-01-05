import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Content from "../components/Content";
import OrderSummary from "../components/OrderSummery";  // Fixed typo in component name from "OrderSummery"
import Sidebar from "../components/Sidebar";
import './FoodOrder.css';

const FoodOrder = () => {
  const location = useLocation();
  const { table } = location.state || {}; // Getting the table data passed through navigation
  const [orders, setOrders] = useState([]);  // State to hold the orders

  // Function to add a dish to the order
  const handleAddToOrder = (dish) => {
    const existingOrder = orders.find((order) => order.item === dish.title);

    if (existingOrder) {
      // If item exists in the order, increment the quantity
      setOrders(
        orders.map((order) =>
          order.item === dish.title ? { ...order, qty: order.qty + 1 } : order
        )
      );
    } else {
      // If item doesn't exist, add it to the order list
      setOrders([
        ...orders,
        {
          id: new Date().getTime(), // Unique ID for each dish added
          item: dish.title,
          qty: 1,
          price: parseFloat(dish.price.replace('$', '')), // Parse price to a number by removing '$'
          note: '',
        },
      ]);
    }
  };

  if (!table) {
    return <div>No table data available</div>; // Show message if no table data passed
  }

  return (
    <div className="body container-fluid d-flex">
      <Sidebar />
      <Content handleAddToOrder={handleAddToOrder} /> {/* Pass the function to Content */}
      <OrderSummary
        table={table}
        orders={orders}
        setOrders={setOrders}  // Pass the orders and setOrders function to update the order list
      />
    </div>
  );
};

export default FoodOrder;
