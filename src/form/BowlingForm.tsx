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
  const [notification, setNotification] = useState({ message: "", show: false });

  useEffect(() => {
    getBowlingLanes().then(setBowlingLanes).catch(setError);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const isEditing = formData.id ? true : false; // Check if we're editing or adding
    const action = isEditing ? editBowlingLane : addBowlingLane;

    action(formData)
      .then(() => {
        // Create a message based on whether it's an edit or add
        const message = isEditing ? `Updated bowling lane ID ${formData.id}🎳` : "Created a new bowling lane🎳";
        setNotification({ message: message, show: true });

        // Display the notification, then navigate after a delay
        setTimeout(() => {
          setNotification({ message: "", show: false });
          window.location.href = "/bowlinglanes";
          getBowlingLanes().then(setBowlingLanes).catch(setError);
        }, 3000); // Show notification for 2 seconds
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
        setNotification({ message: `Deleted bowling lane ID ${formData.id}🎳`, show: true });

        setTimeout(() => {
          window.location.href = "/bowlinglanes";
        }, 3000);
      })
      .catch((error) => {
        setError("Error deleting bowling lane: " + error.message);
        console.error("Error deleting bowling lane:", error);
      });
  }

  function handleBack() {
    navigate("/bowlinglanes"); // Navigate back to the list of lanes
  }

  return (
    <div className="bowling-form">
      {notification.show && <div className="notification">{notification.message}</div>}
      <form onSubmit={handleSubmit}>
        <button className="buttonBack" type="button" onClick={handleBack}>
          Back to Lanes View
        </button>
        <label>
          Lane Number:
          <input type="number" name="laneNumber" value={formData.laneNumber} onChange={handleChange} />
        </label>
        <label>
          For Kids:
          <input type="checkbox" name="forKids" checked={formData.forKids} onChange={handleChange} />
        </label>
        <button type="submit">{formData.id ? "Edit" : "Add"} Bowling Lane</button>
        {formData.id && (
          <button type="button" onClick={handleDelete}>
            Delete Bowling Lane
          </button>
        )}
      </form>
      {error && <p className="error">{error.message}</p>}
      <div className="bowling-lanes-list">
        <h2>Existing Bowling Lanes</h2>
        {bowlingLanes.map((lane) => (
          <div key={lane.id} onClick={() => setFormData(lane)}>
            Lane {lane.laneNumber} - {lane.forKids ? "For Kids" : "Standard"}
          </div>
        ))}
      </div>
    </div>
  );
}
