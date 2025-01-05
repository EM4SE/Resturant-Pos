import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

// Component for live timer
const LiveTimer = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const start = new Date(startTime);
      const now = new Date();
      setElapsedTime(Math.floor((now - start) / 1000)); // Calculate elapsed time in seconds
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [startTime]);

  const formatElapsedTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="live-timer">
      <h2>Work Logged In Time</h2>
      <p>{formatElapsedTime(elapsedTime)}</p>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState(500); // Placeholder for today's sales
  const [tableSales, setTableSales] = useState([
    { table: 1, order: "Pizza", amount: 30 },
    { table: 2, order: "Burger", amount: 20 },
    { table: 3, order: "Pasta", amount: 25 }
  ]); // Sample table sales data
  const [user, setUser] = useState(""); // User's name
  const [loginTime, setLoginTime] = useState(""); // Login time

  // Fetch user data from localStorage on mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const loggedInTime = localStorage.getItem("loginTime");

    if (loggedInUser && loggedInTime) {
      setUser(loggedInUser);
      setLoginTime(loggedInTime);
    } else {
      navigate("/"); // Redirect to login if user is not logged in
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    navigate("/"); // Redirect to the login page
  };

  return (
    <div className="home-container">
      <h1>Welcome, {user}!</h1>
      
      <div className="dashboard">
        <div className="dashboard-card">
          <h2>Today's Sales</h2>
          <p>${salesData}</p>
        </div>

        {/* Live Timer */}
        {loginTime && <LiveTimer startTime={loginTime} />}
      </div>

      {/* Sales Table List */}
      <div className="table-sales">
        <h2>Today's Sales by Table</h2>
        <table>
          <thead>
            <tr>
              <th>Table</th>
              <th>Order</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {tableSales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.table}</td>
                <td>{sale.order}</td>
                <td>${sale.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" >Add New Order</button>
          <button className="action-btn">Process Payment</button>
          <button className="action-btn">View Reports</button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Home;
