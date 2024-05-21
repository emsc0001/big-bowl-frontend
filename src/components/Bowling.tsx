import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBowlingLanes, BowlingLane } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./BowlingLanes.css";

export const BowlingLanes = () => {
  const [bowlingLanes, setBowlingLanes] = useState<BowlingLane[]>([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // Filter state can be 'all', 'kids', 'adults', 'maintenance'
  const auth = useAuth();

  useEffect(() => {
    getBowlingLanes().then((lanes) => {
      console.log("Fetched Bowling Lanes:", lanes);
      setBowlingLanes(lanes);
    });
  }, []);

  const filterLanes = (lane) => {
    switch (filter) {
      case "all":
        return true;
      case "kids":
        return lane.forKids;
      case "adults":
        return !lane.forKids;
      case "maintenance":
        return lane.underMaintenance;
      default:
        return true;
    }
  };

  const getForKidsLabel = (isForKids) => (isForKids ? "🧒" : "🔞");
  const getMaintenanceLabel = (isUnderMaintenance) => (isUnderMaintenance ? " ⚠️" : "");

  return (
    <div className="bowling-container">
      <header className="header">
        <h2>Bowlingbaner</h2>
        <p>Se Ledige Bowlingbaner:</p>
      </header>
      <main className="main-content">
        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>Alle</button>
          <button onClick={() => setFilter("kids")}>Kun Egnet til Børn</button>
          <button onClick={() => setFilter("adults")}>Kun Egnet til voksne</button>
          <button onClick={() => setFilter("maintenance")}>Under Vedligeholdelse</button>
        </div>
        <ul className="bowling-list">
          {bowlingLanes?.filter(filterLanes).map((lane, index) => (
            <li
              key={index}
              className={`bowling-item ${lane.forKids ? "kids-lane" : "adults-lane"} ${lane.underMaintenance ? "under-maintenance" : ""}`}
            >
              <Link to={`/${lane.id}`}>
                🎳 Bowling Bane: {lane.laneNumber}
                {getForKidsLabel(lane.forKids)}
                {getMaintenanceLabel(lane.underMaintenance)}
              </Link>
              {auth.isLoggedInAs(["ADMIN", "USER"]) && (
                <Link className="bowling-btn" to="/addBowlingLane" state={lane}>
                  Rediger
                </Link>
              )}
            </li>
          ))}
        </ul>
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Big Bowl. Alle rettigheder forbeholdes.</p>
      </footer>
    </div>
  );
};
