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
        const message = isEditing ? `Updated Employee ${formData.id}🔨` : "Added New Employee🆕";
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

      if (value === "MORNING") {
        shiftStart = new Date();
        shiftStart.setHours(9, 0, 0, 0);
        shiftEnd = new Date();
        shiftEnd.setHours(15, 59, 0, 0);
      } else if (value === "EVENING") {
        shiftStart = new Date();
        shiftStart.setHours(16, 0, 0, 0);
        shiftEnd = new Date();
        shiftEnd.setHours(23, 59, 0, 0);
      }

      setFormData((prevData) => ({
        ...prevData,
        shift: value,
        shiftStart,
        shiftEnd,
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
        setNotification({ message: `Deleted Employee ${formData.id}🗑`, show: true, type: "delete" });
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
          Name:
          <input type="text" name="name" value={formData.name || ""} onChange={handleChange} />
        </label>
        <label>
          Roles:
          <select name="role" value={formData.role || ""} onChange={handleChange}>
            <option value="MANAGER">Manager</option>
            <option value="TICKET_SELLER">Ticket Seller</option>
            <option value="EQUIPMENT_OPERATOR">Equipment Operator</option>
            <option value="CLEANING_STAFF">Cleaning Staff</option>
          </select>
        </label>
        <label>
          Shift:
          <select name="shift" value={formData.shift || ""} onChange={handleChange}>
            <option value="MORNING">Morning</option>
            <option value="EVENING">Evening</option>
          </select>
        </label>

        <label>
          Shift Start:
          <input type="datetime-local" name="shiftStart" value={formData.shiftStart.toISOString().slice(0, 16)} onChange={handleChange} />
        </label>
        <label>
          Shift End:
          <input type="datetime-local" name="shiftEnd" value={formData.shiftEnd.toISOString().slice(0, 16)} onChange={handleChange} />
        </label>
        <button type="submit" onClick={handleSubmit}>
          {formData.id ? "Redgier Medarbejder" : "Tilføj Medarbejder"}
        </button>
        {formData.id && (
          <button type="button" onClick={handleDelete}>
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
