import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addEmployee, editEmployee, deleteEmployee, getEmployees, Employee } from "../services/apiFacade";

import "./EmployeeForm.css";

const EMPTY_EMPLOYEE: Employee = {
  id: 0,
  name: "",
  role: "",
  shift: "",
  shiftStart: new Date(),
  shiftEnd: new Date(),
};

export default function EmployeeForm() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const employeeToEdit = location.state?.employee || EMPTY_EMPLOYEE;
  const [formData, setFormData] = useState<Employee>(employeeToEdit);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", show: false, type: "" });

  useEffect(() => {
    getEmployees().then(setEmployees).catch(setError);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const isEditing = formData.id ? true : false;
    const action = isEditing ? editEmployee : addEmployee;

    action(formData)
      .then(() => {
        const message = isEditing ? `Opdateret Medarbejder ${formData.name}🔨` : `Tilføjet Ny Medarbejde🆕"${formData.name}🆕`;
        setNotification({ message: message, show: true, type: "addEdit" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          window.location.href = "/employees";
          getEmployees().then(setEmployees).catch(setError);
        }, 1900);
      })
      .catch((error) => {
        setError("Error processing employee: " + error.message);
        console.error("Error processing employee:", error);
      });
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "shift") {
      let shiftStart, shiftEnd;

      const today = new Date();
      const year = today.getUTCFullYear();
      const month = today.getUTCMonth();
      const date = today.getUTCDate();

      if (value === "MORNING") {
        shiftStart = new Date(Date.UTC(year, month, date, 11 - 2, 0, 0));
        shiftEnd = new Date(Date.UTC(year, month, date, 18 - 2, 0, 0));
      } else if (value === "EVENING") {
        shiftStart = new Date(Date.UTC(year, month, date, 18 - 2, 0, 0));
        shiftEnd = new Date(Date.UTC(year, month, date, 23, 61 - 2, 0));
      }

      setFormData((prevData) => ({
        ...prevData,
        shift: value,
        shiftStart: shiftStart,
        shiftEnd: shiftEnd,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  function handleDelete() {
    if (!formData.id) return;

    deleteEmployee(formData.id)
      .then(() => {
        setNotification({ message: `Slettet Medarbejder ${formData.name}🗑`, show: true, type: "delete" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          window.location.href = "/employees";
          getEmployees().then(setEmployees).catch(setError);
        }, 1900);
      })
      .catch((error) => {
        setError("Error deleting employee: " + error.message);
        console.error("Error deleting employee:", error);
      });
  }

  function handleBack() {
    navigate("/employees");
  }
  console.log(formData);
  // Send formData to server...
  return (
    <div className="employee-form-container">
      <button className="buttonBack" type="button" onClick={handleBack}>
        Tilbage
      </button>
      <h2>{formData.id ? "Rediger medarbejder" : "Tilføj Medarbejder"}</h2>
      <form className="employee-form">
        <label>
          Navn:
          <input type="text" name="name" value={formData.name || ""} onChange={handleChange} />
        </label>
        <label>
          Roller:
          <select name="role" value={formData.role || ""} onChange={handleChange}>
            <option value="">Vælg En Rolle...</option>
            <option value="MANAGER">Manager</option>
            <option value="TICKET_SELLER">Ticket Seller</option>
            <option value="EQUIPMENT_OPERATOR">Equipment Operator</option>
            <option value="CLEANING_STAFF">Cleaning Staff</option>
          </select>
        </label>
        <label>
          Vagt Type:
          <select name="shift" value={formData.shift || ""} onChange={handleChange}>
            <option value="">Vælg En Vagttype...</option>
            <option value="MORNING">Morning</option>
            <option value="EVENING">Evening</option>
          </select>
        </label>
        <button className="editButton1" type="submit" onClick={handleSubmit}>
          {formData.id ? "Redgier Medarbejder" : "Tilføj Medarbejder"}
        </button>
        {formData.id && (
          <button className="deleteButton1" type="button" onClick={handleDelete}>
            Slet Medarbejder
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
      {notification.show && notification.type === "delete" && <div className="notificationDelete">{notification.message}</div>}
      {notification.show && notification.type === "addEdit" && <div className="notificationAddEdit">{notification.message}</div>}
    </div>
  );
}
