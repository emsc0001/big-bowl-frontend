import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminDashBoard.css";

const AdminDashBoard = () => {
  return (
    <li className="dropdown">
      <a href="#" className="dropbtn">
        Admin Dashboard
      </a>
      <div className="dropdown-content">
        <NavLink to="/bowlinglanes">Se Bowling Baner</NavLink>
        <NavLink to="/airhockey">Se Air Hockey Borde</NavLink>
        <NavLink to="/dinner">Se Spise Borde</NavLink>
      </div>
    </li>
  );
};

export default AdminDashBoard;
