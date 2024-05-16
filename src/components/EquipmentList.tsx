import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEquipment, Equipment } from "../services/apiFacade"; // Uncomment this line
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./EquipmentList.css";

export const EquipmentList = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all");
  const auth = useAuth();

  useEffect(() => {
    getEquipment()
      .then((data) => {
        setEquipment(data);
      })
      .catch(console.error);
  }, []);

  const handleTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const filteredEquipment = equipment.filter((eq) => {
    return filterType === "all" || eq.type === filterType;
  });

  return (
    <div className="equipment-container">
      <header>
        <h1>Equipment List 🎳🏓</h1>
        <div>
          <select className="filterButton" onChange={handleTypeChange}>
            <option value="all">All Types</option>
            <option value="BOWLING_LANE">Bowling Lanes</option>
            <option value="AIR_HOCKEY">Air Hockey Tables</option>
            <option value="DINNER_TABLE">Dinner Tables</option>
          </select>
        </div>
      </header>
      <ul className="equipment-list">
        {filteredEquipment.map((eq, index) => (
          <li key={index} className="equipment-item">
            <Link to={`/equipment/${eq.id}`}>
              <h2>
                {eq.name} ({eq.type})
              </h2>
            </Link>
            {auth.isLoggedInAs(["ADMIN"]) && (
              <Link className="add-edit-button" to="/addEquipment" state={{ equipment: eq }}>
                Edit
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentList;
