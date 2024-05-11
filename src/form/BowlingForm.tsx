import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addBowlingLane, editBowlingLane, deleteBowlingLane, getBowlingLanes, BowlingLane } from "../services/apiFacade";

import "./BowlingForm.css";

const EMPTY_BOWLINGLANE: BowlingLane = {
  id: 0,
  laneNumber: 0,
  forKids: false,
};

export default function BowlingForm() {
  const [bowlingLanes, setBowlingLanes] = useState<BowlingLane[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const bowlingLaneToEdit = location.state?.bowlingLane || EMPTY_BOWLINGLANE;
  const [formData, setFormData] = useState<BowlingLane>(bowlingLaneToEdit);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", show: false, type: "" });

  useEffect(() => {
    getBowlingLanes().then(setBowlingLanes).catch(setError);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const isEditing = formData.id ? true : false;
    const action = isEditing ? editBowlingLane : addBowlingLane;

    action(formData)
      .then(() => {
        const message = isEditing ? `Opdateret Bowling Bane ${formData.id}🔨` : "Oprettet En Nyt Bowling Bane🆕";
        setNotification({ message: message, show: true, type: "addEdit" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          window.location.href = "/bowlinglanes";
          getBowlingLanes().then(setBowlingLanes).catch(setError);
        }, 1900);
      })
      .catch((error) => {
        setError("Error processing bowling lane: " + error.message);
        console.error("Error processing bowling lane:", error);
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

    deleteBowlingLane(formData.id)
      .then(() => {
        setNotification({ message: `Slettet Bowling Bane ${formData.id}🗑`, show: true, type: "delete" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          window.location.href = "/bowlinglanes";
        }, 1900);
      })
      .catch((error) => {
        setError("Error deleting bowling lane: " + error.message);
        console.error("Error deleting bowling lane:", error);
      });
  }

  function handleBack() {
    navigate("/bowlinglanes");
  }

  return (
    <div className="bowling-form">
      {notification.show && notification.type === "delete" && <div className="notificationDelete">{notification.message}</div>}
      {notification.show && notification.type === "addEdit" && <div className="notificationAddEdit">{notification.message}</div>}
      <form onSubmit={handleSubmit}>
        <button className="buttonBack" type="button" onClick={handleBack}>
          Tilbage
        </button>
        <label>
          Bane Nummer:
          <input type="number" name="laneNumber" value={formData.laneNumber} onChange={handleChange} />
        </label>
        <label>
          For Børn
          <input type="checkbox" name="forKids" checked={formData.forKids} onChange={handleChange} />
        </label>
        <button type="submit">{formData.id ? "Rediger" : "Opret"} Bowling Bane</button>
        {formData.id && (
          <button type="button" onClick={handleDelete}>
            Slet Bowling Bane
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
      <div className="bowling-lanes-list">
        <h2>Eksisterende Bowling Baner</h2>
        {bowlingLanes.map((lane) => (
          <div key={lane.id} onClick={() => setFormData(lane)}>
            Bane {lane.laneNumber} - {lane.forKids ? "For Børn" : "Standard"}
          </div>
        ))}
      </div>
    </div>
  );
}
