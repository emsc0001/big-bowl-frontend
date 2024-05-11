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
        const message = isEditing ? `Updated air hockey table ID ${formData.id}` : "Created a new air hockey table";
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
        setNotification({ message: `Deleted air hockey table ID ${formData.id}`, show: true, type: "delete" });
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
          Back to Tables View
        </button>
        <label>
          Table Number:
          <input type="number" name="tableNumber" value={formData.tableNumber} onChange={handleChange} />
        </label>
        <button type="submit">{formData.id ? "Edit" : "Add"} Air Hockey Table</button>
        {formData.id && (
          <button type="button" onClick={handleDelete}>
            Delete Air Hockey Table
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
      <div className="air-hockey-tables-list">
        <h2>Existing Air Hockey Tables</h2>
        {airHockeys.map((table) => (
          <div key={table.id} onClick={() => setFormData(table)}>
            Table {table.tableNumber}
          </div>
        ))}
      </div>
    </div>
  );
}
