import React from "react";
import { NavLink } from "react-router-dom";
import './Sidebar.css';

const Sidebar = () => (
  <div className="sidebar">
    {/* Home Link */}
    <NavLink to="/home" className="nav-link" activeClassName="active" title="Home">
      <i className="bi bi-house-fill"></i>
    </NavLink>
    
    {/* Tables Link */}
    <NavLink to="/tables" className="nav-link" activeClassName="active" title="Tables">
      <i className="bi bi-table"></i> {/* Icon for Tables */}
    </NavLink>
    
    {/* Settings Link */}
    <NavLink to="/settings" className="nav-link" activeClassName="active" title="Settings">
      <i className="bi bi-gear-fill"></i>
    </NavLink>
    
    {/* Messages Link */}
    <NavLink to="/messages" className="nav-link" activeClassName="active" title="Messages">
      <i className="bi bi-envelope-fill"></i>
    </NavLink>
    
    {/* Notifications Link */}
    <NavLink to="/notifications" className="nav-link" activeClassName="active" title="Notifications">
      <i className="bi bi-bell-fill"></i>
    </NavLink>
    
   
  </div>
);

export default Sidebar;
