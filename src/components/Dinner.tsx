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
      <h1>Spisning</h1>

      <div className="dinner-tables">
        {dinnerTables.map((table) => (
          <Link key={table.id} to={auth.isLoggedIn() ? `/dinner/${table.id}` : "/login"}>
            <div className="dinner-table">
              <h2>Bord {table.id}</h2>
              <p>{table.tableNumber ? "Optaget" : "Ledigt"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
