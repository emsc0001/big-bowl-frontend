import { useState, useEffect } from "react";
import { getBowlingLanes, BowlingLane } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./BowlingLanes.css";

export const BowlingLanes = () => {
  const [bowlingLanes, setBowlingLanes] = useState<BowlingLane[]>();
  const auth = useAuth();

  useEffect(() => {
    getBowlingLanes().then((res) => setBowlingLanes(res));
  }, []);

  const getForKidsLabel = (isForKids: boolean) => {
    return isForKids ? "🧒 Kids-friendly" : "🔞 Adults-only";
  };

  return (
    <div className="bowling-container">
      <header className="header">
        <h2>Bowlingbaner</h2>
        <p>Se Bowlingbaner:</p>
      </header>
      <img
        className="logo"
        src="https://i.ibb.co/9rQBkgw/DALL-E-2024-05-09-14-25-21-A-vibrant-and-modern-logo-for-a-bowling-alley-named-Big-Bowl-The-logo-inc.webp"
        alt="Big Bowl Logo"
      />
      <main className="main-content">
        <ul className="bowling-list">
          {bowlingLanes?.map((bowlingLane, index) => (
            <li className={`bowling-item ${bowlingLane.isForKids ? "kids-lane" : "adults-lane"}`} key={index}>
              <Link to={`/${bowlingLane.id}`}>
                🎳 Bowling lane: {bowlingLane.laneNumber} - {getForKidsLabel(bowlingLane.isForKids)}
              </Link>
              {auth.isLoggedInAs(["ADMIN", "USER"]) && (
                <Link className="bowling-btn" to="/addBowlingLane" state={bowlingLane}>
                  Edit
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
