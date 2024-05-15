import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addEmployee, editEmployee, deleteEmployee, getEmployees, Employee } from "../services/apiFacade";

import "./EmployeeForm.css";

const EMPTY_EMPLOYEE: Employee = {
  id: 0,
  name: "",
  role: "",
  shift: "" as "MORNING" | "EVENING",
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
    <div className="employee-form">
      {notification.show && notification.type === "delete" && <div className="notificationDelete">{notification.message}</div>}
      <h2>{formData.id ? "Edit Employee" : "Add Employee"}</h2>
      <form className="employee-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name || ""} onChange={handleChange} />
        </label>
        <label>
          Role:
          <input type="text" name="role" value={formData.role || ""} onChange={handleChange} />
        </label>
        <label>
          Shift:
          <input type="radio" name="shift" value="MORNING" checked={formData.shift === "MORNING" || false} onChange={handleChange} />
          Morning
          <input type="radio" name="shift" value="EVENING" checked={formData.shift === "EVENING" || false} onChange={handleChange} />
          Evening
        </label>
        <button type="submit">{formData.id ? "Update" : "Add"}</button>
        {formData.id && (
          <button className="delete" type="button" onClick={handleDelete}>
            Delete
          </button>
        )}
        <button type="button" onClick={handleBack}>
          Back
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
