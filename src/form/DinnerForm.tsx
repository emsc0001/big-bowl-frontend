import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addDinnerTable, editDinnerTable, deleteDinnerTable, getDinnerTables, DinnerTable } from "../services/apiFacade";

import "./DinnerForm.css";

const EMPTY_DINNERTABLE: DinnerTable = {
  id: 0,
  tableNumber: 0,
};

export default function DinnerForm() {
  const [dinnerTables, setDinnerTables] = useState<DinnerTable[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dinnerTableToEdit = location.state?.dinnerTable || EMPTY_DINNERTABLE;
  const [formData, setFormData] = useState<DinnerTable>(dinnerTableToEdit);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", show: false, type: "" });

  useEffect(() => {
    getDinnerTables().then(setDinnerTables).catch(setError);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const action = formData.id ? editDinnerTable : addDinnerTable;
    action(formData)
      .then(() => {
        const message = formData.id ? `Opdateret Dinner Bord ${formData.id}` : "Oprettet Et Nyt Dinner Bord";
        setNotification({ message: message, show: true, type: "addEdit" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          navigate("/dinner");
          getDinnerTables().then(setDinnerTables).catch(setError);
        }, 3000);
      })
      .catch((error) => {
        setError("Error processing dinner table: " + error.message);
      });
  }

  function handleDelete() {
    if (!formData.id) return;
    deleteDinnerTable(formData.id)
      .then(() => {
        setNotification({ message: `Slettet Dinner Bord ${formData.id}`, show: true, type: "delete" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          navigate("/dinner");
          getDinnerTables().then(setDinnerTables).catch(setError);
        }, 3000);
      })
      .catch((error) => setError("Error deleting dinner table: " + error.message));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="dinner-form">
      {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}
      <form onSubmit={handleSubmit}>
        <button type="button" onClick={() => navigate("/dinner")}>
          Tilbage til Bordliste
        </button>
        <label>
          Bord Nummer:
          <input type="number" name="tableNumber" value={formData.tableNumber} onChange={handleChange} required />
        </label>
        <button type="submit">{formData.id ? "Rediger" : "Opret"} Bord</button>
        {formData.id && (
          <button type="button" onClick={handleDelete}>
            Slet Bord
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
      <div className="dinner-tables-list1">
        <h2>Eksisterende Dinner Borde</h2>
        {dinnerTables.map((table) => (
          <div key={table.id} onClick={() => setFormData(table)}>
            Bord {table.tableNumber}
          </div>
        ))}
      </div>
    </div>
  );
}
