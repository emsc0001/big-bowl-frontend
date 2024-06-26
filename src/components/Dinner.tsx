import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDinnerTables, DinnerTable } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./Dinner.css";

export const Dinner = () => {
  const [dinnerTables, setDinnerTables] = useState<DinnerTable[]>([]);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    getDinnerTables().then((data) => setDinnerTables(data));
  }, []);

  function handleBack() {
    navigate("/admin");
  }

  return (
    <div className="dinner-container">
      <header>
        <h1>Book Et Bord Her!🍽️</h1>
      </header>
      <img
        className="logo"
        src="https://i.ibb.co/9rQBkgw/DALL-E-2024-05-09-14-25-21-A-vibrant-and-modern-logo-for-a-bowling-alley-named-Big-Bowl-The-logo-inc.webp"
        alt="Big Bowl Logo"
      />

      <button className="buttonBack" type="button" onClick={handleBack}>
        Tilbage
      </button>
      <div className="dinner-tables-list">
        {dinnerTables.map((table, index) => (
          <li key={index} className="dinner-table-item">
            <Link to={`/dinner/${table.id}`}>
              <h2>Bord {table.tableNumber}</h2>
              <div className="decorations">
                {" "}
                {/* Placeholder for visual effects */}
                <div className="plate"></div> {/* Example for a plate */}
              </div>
            </Link>
            {auth.isLoggedInAs(["ADMIN", "USER"]) && (
              <Link className="add-edit-button" to="/addDinnerTable" state={{ table }}>
                Rediger
              </Link>
            )}
          </li>
        ))}
      </div>
    </div>
  );
};
