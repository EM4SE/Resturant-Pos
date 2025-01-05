import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import TableArrange from "./pages/TableArrange";
import FoodOrder from "./pages/FoodOrder";
import BillingPage from "./pages/BillingPage";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import BillsPage from "./pages/BillsPage"; // Import the BillsPage component

function App() {
  const isLoggedIn = localStorage.getItem("user"); // Check for user login status
  const location = useLocation(); // Get current route location

  // Define routes where sidebar should NOT be displayed
  const hideSidebarRoutes = ["/"];

  // Check if the sidebar should be hidden
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Show Sidebar only if logged in and not on a route where it's hidden */}
      {isLoggedIn && !shouldHideSidebar && <Sidebar />}

      {/* Main content area for routes */}
      <div className={`content-area ${isLoggedIn && !shouldHideSidebar ? "" : "full-width"}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} /> {/* Login as the default page */}

          {/* Protected Routes */}
          {isLoggedIn ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/tables" element={<TableArrange />} />
              <Route path="/food-order" element={<FoodOrder />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/bills" element={<BillsPage />} /> {/* New Route for BillsPage */}
            </>
          ) : (
            // Redirect to Login page if not logged in
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
