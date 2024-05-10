import { useState, useEffect } from "react";
import { getDinnerTables, DinnerTable } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./Dinner.css";

export const Dinner = () => {
  const [dinnerTables, setDinnerTables] = useState<DinnerTable[]>([]);
  const auth = useAuth();

  useEffect(() => {
    getDinnerTables().then((data) => setDinnerTables(data));
  }, []);

  return (
    <div className="dinner-container">
      <header>
        <h1>Book Et Bord Her!</h1>
      </header>
      <img
        className="logo"
        src="https://i.ibb.co/9rQBkgw/DALL-E-2024-05-09-14-25-21-A-vibrant-and-modern-logo-for-a-bowling-alley-named-Big-Bowl-The-logo-inc.webp"
        alt="Big Bowl Logo"
      />
      <div className="dinner-tables">
        {dinnerTables.map((table) => (
          <Link key={table.id} to={auth.isLoggedIn() ? `/dinner/${table.id}` : "/login"}>
            <div className="dinner-table">
              <h2>Bord {table.tableNumber}</h2>
              {/* <p>{ "Optaget" : "Ledigt"}</p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
