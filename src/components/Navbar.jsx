import React, { useState } from "react";
import "./navbar.css";

const Navbar = ({ navItems }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Set Active Tab
  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="nav-wrapper">
      <div className="nav-tabs-container">
        <ul className="nav-tabs">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <button
                className={`nav-link ${activeIndex === index ? "active" : ""}`}
                onClick={() => handleTabClick(index)}
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
