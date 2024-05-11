import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addAirHockey, editAirHockey, deleteAirHockey, getAirHockeys, AirHockey } from "../services/apiFacade";

import "./AirHockeyForm.css";

const EMPTY_AIRHOCKEY: AirHockey = {
  id: 0,
  tableNumber: 0,
};

export default function AirHockeyForm() {
  const [airHockeys, setAirHockeys] = useState<AirHockey[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const airHockeyToEdit = location.state?.airHockey || EMPTY_AIRHOCKEY;
  const [formData, setFormData] = useState<AirHockey>(airHockeyToEdit);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", show: false, type: "" });

  useEffect(() => {
    getAirHockeys().then(setAirHockeys).catch(setError);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const isEditing = formData.id ? true : false;
    const action = isEditing ? editAirHockey : addAirHockey;

    action(formData)
      .then(() => {
        const message = isEditing ? `Opdateret Air Hockey bord ${formData.id}🔨` : "Oprettet et nyt Air Hockey bord🆕";
        setNotification({ message: message, show: true, type: "addEdit" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          window.location.href = "/airhockey";
          getAirHockeys().then(setAirHockeys).catch(setError);
        }, 3000);
      })
      .catch((error) => {
        setError("Error processing air hockey table: " + error.message);
        console.error("Error processing air hockey table:", error);
      });
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleDelete() {
    if (!formData.id) return;

    deleteAirHockey(formData.id)
      .then(() => {
        setNotification({ message: `Slettet Air Hockey Bord ${formData.id}`, show: true, type: "delete" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          window.location.href = "/airhockey";
        }, 3000);
      })
      .catch((error) => {
        setError("Error deleting air hockey table: " + error.message);
        console.error("Error deleting air hockey table:", error);
      });
  }

  function handleBack() {
    navigate("/airhockey");
  }

  return (
    <div className="air-hockey-form">
      {notification.show && notification.type === "delete" && <div className="notificationDelete">{notification.message}</div>}
      {notification.show && notification.type === "addEdit" && <div className="notificationAddEdit">{notification.message}</div>}
      <form onSubmit={handleSubmit}>
        <button className="buttonBack" type="button" onClick={handleBack}>
          Tilbage
        </button>
        <label>
          Bord Nummer:
          <input type="number" name="tableNumber" value={formData.tableNumber} onChange={handleChange} />
        </label>
        <button type="submit">{formData.id ? "Rediger" : "Opret"} Air Hockey Bord</button>
        {formData.id && (
          <button type="button" onClick={handleDelete}>
            Slet Air Hockey Bord
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
      <div className="air-hockey-tables-list">
        <h2>Eksisterende Air Hockey Borde</h2>
        {airHockeys.map((table) => (
          <div key={table.id} onClick={() => setFormData(table)}>
            Bord {table.tableNumber}
          </div>
        ))}
      </div>
    </div>
  );
}
