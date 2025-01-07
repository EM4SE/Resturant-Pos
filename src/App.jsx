import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import TableArrange from "./pages/TableArrange";
import FoodOrder from "./pages/FoodOrder";
import BillingPage from "./pages/BillingPage";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import BillsPage from "./pages/BillsPage";
import OrderSummary from "./components/OrderSummery";

function App() {
  const isLoggedIn = localStorage.getItem("user");
  const location = useLocation();

  // Update routes where sidebar should NOT be displayed
  const hideSidebarRoutes = ["/login"];

  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {isLoggedIn && !shouldHideSidebar && <Sidebar />}

      <div className={`content-area ${isLoggedIn && !shouldHideSidebar ? "" : "full-width"}`}>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          {isLoggedIn ? (
            <>
              <Route path="/" element={<TableArrange />} /> {/* Make TableArrange the default page for logged-in users */}
              <Route path="/home" element={<Home />} />
              <Route path="/tables" element={<TableArrange />} />
              <Route path="/food-order" element={<FoodOrder />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/bills" element={<BillsPage />} />
              <Route path="/order-summary" element={<OrderSummary />} />
            </>
          ) : (
            // Redirect to Login if not logged in
            <Route path="*" element={<Navigate to="/login" />} />
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