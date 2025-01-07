import React, { useState, useEffect } from "react";
import "./navbar.css";

const Navbar = ({ navItems, onCategoryClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle initial "All" category
  useEffect(() => {
    if (navItems.length > 0) {
      onCategoryClick(navItems[0]);
    }
  }, [navItems]);

  // Set Active Tab and trigger category filter
  const handleTabClick = (index, category) => {
    setActiveIndex(index);
    onCategoryClick(category);
  };

  return (
    <div className="nav-wrapper">
      <div className="nav-tabs-container">
        <ul className="nav-tabs">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <button
                className={`nav-link ${activeIndex === index ? "active" : ""}`}
                onClick={() => handleTabClick(index, item)}
              >
                {item}
              </button>
              {/* Animated Active Indicator */}
              {activeIndex === index && <div className="tab-indicator"></div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;