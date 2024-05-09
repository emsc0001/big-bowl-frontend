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
            </div>
        </li>

        
    );
};

export default AddDropdownMenu;
