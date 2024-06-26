import { useState, useEffect } from "react";
import { getAirHockeys, AirHockey } from "../services/apiFacade";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./AirHockey.css";

export const AirHockeys = () => {
  const [airHockeys, setAirHockeys] = useState<AirHockey[]>();
  const navigate = useNavigate();

  const auth = useAuth();

  useEffect(() => {
    getAirHockeys().then((res) => setAirHockeys(res));
  }, []);

  function handleBack() {
    navigate("/admin");
  }

  return (
    <div className="airhockey-container">
      <header className="header">
        <h2>AirHockey🏒</h2>
        <p>Se Ledige Borde:</p>
      </header>
      <img
        className="logo"
        src="https://i.ibb.co/9rQBkgw/DALL-E-2024-05-09-14-25-21-A-vibrant-and-modern-logo-for-a-bowling-alley-named-Big-Bowl-The-logo-inc.webp"
        alt="Big Bowl Logo"
      />
      <main className="main-content">
        <button className="buttonBack" type="button" onClick={handleBack}>
          Tilbage
        </button>
        <ul className="airhockey-list">
          {airHockeys?.map((airHockey, index) => (
            <li className="airhockey-item" key={index}>
              <Link to={`/${airHockey.id}`}>
                🏒Airhockey Bord: {airHockey.tableNumber}
                <img
                  className="airhockeyImg"
                  src="https://i.ibb.co/c8QM3b1/DALL-E-2024-05-09-19-44-06-A-3-D-dynamic-illustration-of-an-air-hockey-table-seen-from-a-top-down-pe.webp"
                  alt="airhockeytable"
                />
              </Link>
              {auth.isLoggedInAs(["ADMIN", "USER"]) && (
                <Link className="airhockey-btn" to="/addAirHockey" state={airHockey}>
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
