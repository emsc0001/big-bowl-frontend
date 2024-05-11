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

  useEffect(() => {
    getBowlingLanes().then(setBowlingLanes).catch(setError);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const action = formData.id ? editBowlingLane : addBowlingLane;
    action(formData)
      .then(() => {
        navigate("/bowlinglanes"); // Navigate to the lanes view after operation
        getBowlingLanes().then(setBowlingLanes).catch(setError);
      })
      .catch(setError);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleDelete() {
    if (formData.id) {
      deleteBowlingLane(formData.id)
        .then(() => {
          navigate("/bowlinglanes"); // Navigate to lanes view after deletion
          getBowlingLanes().then(setBowlingLanes).catch(setError);
        })
        .catch(setError);
    }
  }

  function handleBack() {
    navigate("/bowlinglanes"); // Navigate back to the list of lanes
  }

  return (
    <div className="bowling-form">
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
      {error && <p>Error: {error.message}</p>}{" "}
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
