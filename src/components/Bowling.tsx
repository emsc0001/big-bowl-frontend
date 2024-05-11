import { useState, useEffect } from "react";
import { getBowlingLanes, BowlingLane } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./BowlingLanes.css";

export const BowlingLanes = () => {
  const [bowlingLanes, setBowlingLanes] = useState<BowlingLane[]>();
  const [filter, setFilter] = useState<string>("all"); // Filter state: 'all', 'kids', or 'adults'
  const auth = useAuth();

  useEffect(() => {
    getBowlingLanes().then((res) => {
      console.log("Fetched Bowling Lanes:", res);
      setBowlingLanes(res);
    });
  }, []);

  // Filter function to determine which lanes to show
  const filterLanes = (lane: BowlingLane) => {
    if (filter === "all") return true;
    if (filter === "kids") return lane.forKids;
    if (filter === "adults") return !lane.forKids;
    return true;
  };

  // Set filter label for kids or adults
  const getForKidsLabel = (isForKids: boolean) => {
    return isForKids ? "🧒" : "🔞";
  };

  return (
    <div className="bowling-container">
      <header className="header">
        <h2>Bowlingbaner</h2>
        <p>Se Ledige Bowlingbaner:</p>
      </header>
      <img
        className="logo"
        src="https://i.ibb.co/9rQBkgw/DALL-E-2024-05-09-14-25-21-A-vibrant-and-modern-logo-for-a-bowling-alley-named-Big-Bowl-The-logo-inc.webp"
        alt="Big Bowl Logo"
      />
      <main className="main-content">
        <div className="filter-buttons">
          {/* Filter Buttons */}
          <button onClick={() => setFilter("all")}>Alle</button>
          <button onClick={() => setFilter("kids")}>Kun Egnet til Børn</button>
          <button onClick={() => setFilter("adults")}>Kun Egnet til voksne</button>
        </div>

        {/* Display Bowling Lanes based on the current filter */}
        <ul className="bowling-list">
          {bowlingLanes?.filter(filterLanes).map((bowlingLane, index) => (
            <li className={`bowling-item ${bowlingLane.forKids ? "kids-lane" : "adults-lane"}`} key={index}>
              <Link to={`/${bowlingLane.id}`}>
                🎳 Bowling Bane: {bowlingLane.laneNumber} {getForKidsLabel(bowlingLane.forKids)}
              </Link>
              {auth.isLoggedInAs(["ADMIN", "USER"]) && (
                <Link className="bowling-btn" to="/addBowlingLane" state={bowlingLane}>
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
