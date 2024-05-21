import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEquipment, Equipment, updateEquipmentStatus, getBowlingLanes, BowlingLane } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./EquipmentList.css";
import OrderEquipmentModal from "./OrderEquipmentModal"; // Correct import

export const EquipmentList = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bowlingLanes, setBowlingLanes] = useState<BowlingLane[]>(); // New state for bowling lanes
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all");
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getEquipment()
      .then((data) => {
        setEquipment(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getBowlingLanes().then((res) => {
      console.log("Fetched Bowling Lanes:", res);
      setBowlingLanes(res);
    });
  }, []);

  const handleTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const filteredEquipment = equipment.filter((eq) => {
    return filterType === "all" || eq.type === filterType;
  });

  const handleStatusUpdate = (id: number, newStatus: string) => {
    updateEquipmentStatus(id, newStatus)
      .then((updatedEquipment) => {
        setEquipment((prevEquipment) => prevEquipment.map((eq) => (eq.id === id ? updatedEquipment : eq)));
      })
      .catch((error) => console.error("Error updating equipment status:", error));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const addNewEquipment = (newEquipment: Equipment) => {
    setEquipment((prevEquipment) => [...prevEquipment, newEquipment]);
  };

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
          <button onClick={handleOpenModal}>Order New Equipment</button>
        </div>
      </header>
      <table className="equipment-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEquipment.map((eq) => (
            <tr key={`${eq.type}-${eq.name}`}>
              <td>{eq.type}</td>
              <td>{eq.id}</td>
              <td>
                <Link to={`/equipment/${eq.id}`}>{eq.name}</Link>
              </td>
              <td>{eq.quantity}</td>
              <td>{eq.status}</td>
              <td>{auth.isLoggedInAs(["ADMIN"]) && <button onClick={() => handleStatusUpdate(eq.id, "DEFECTIVE")}>Mark as Defective</button>}</td>
            </tr>
          ))}

          {/* Display bowlinglanes that are under maintance */}
          {bowlingLanes
            ?.filter((lane) => lane.underMaintenance)
            .map((lane) => (
              <tr key={lane.id}>
                <td> </td>
                <td> {lane.id}</td>

                <td>
                  <Link to={`/equipment/${lane.id}`}> Bane Nummer {lane.laneNumber}</Link>
                </td>
                <td>{auth.isLoggedInAs(["ADMIN"]) && <button onClick={() => handleStatusUpdate(lane.id, "DEFECTIVE")}>Mark as Defective</button>}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {isModalOpen && <OrderEquipmentModal onClose={handleCloseModal} addNewEquipment={addNewEquipment} />}
    </div>
  );
};

export default EquipmentList;
