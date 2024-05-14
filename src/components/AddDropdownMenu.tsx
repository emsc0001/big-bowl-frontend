import React from "react";
import { NavLink } from "react-router-dom";
import "./addDropdownMenu.css";

const AddDropdownMenu = () => {
  return (
    <li className="dropdown">
      <a href="#" className="dropbtn">
        Tilføj
      </a>
      <div className="dropdown-content">
        <NavLink to="/addProduct">Tilføj Produkt</NavLink>
        <NavLink to="/addBowlingLane">Tilføj Bowling Bane</NavLink>
        <NavLink to="/addAirHockey">Tilføj Air Hockey Bord</NavLink>
        <NavLink to="/addDinnerTable">Tilføj Bord</NavLink>
      </div>
    </li>
  );
};

export default AddDropdownMenu;
