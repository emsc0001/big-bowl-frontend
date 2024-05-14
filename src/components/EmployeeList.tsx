import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees, Employee } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./EmployeeList.css";

const localizer = momentLocalizer(moment);

export const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("list"); // 'list' or 'calendar'
  const auth = useAuth();

  useEffect(() => {
    getEmployees()
      .then((data) => {
        const today = moment().format("YYYY-MM-DD"); // Use today's date for the schedule
        const mappedData = data.map((emp) => {
          // Combine the current date with time from backend to ensure correct Date object creation
          const shiftStart = moment(`${today}T${emp.shiftStart}`).toDate();
          const shiftEnd = moment(`${today}T${emp.shiftEnd}`).toDate();

          return {
            ...emp,
            shiftStart,
            shiftEnd,
          };
        });
        setEmployees(mappedData);
      })
      .catch(console.error);
  }, []);

  const events = employees.map((emp) => ({
    title: `${emp.name} - ${emp.role} (${emp.shift})`,
    start: emp.shiftStart,
    end: emp.shiftEnd,
    allDay: false,
  }));

  return (
    <div className="employee-container">
      <header>
        <h1>Employee List 👩‍💼👨‍💼</h1>
        <div>
          <button className="buttonsChange" onClick={() => setViewType("list")}>
            List View
          </button>
          <button className="buttonsChange" onClick={() => setViewType("calendar")}>
            Calendar View
          </button>
        </div>
      </header>
      {viewType === "list" ? (
        <ul className="employee-list">
          {employees.map((employee, index) => (
            <li key={index} className="employee-item">
              <Link to={`/employee/${employee.id}`}>
                <h2>
                  {employee.name} - {employee.role} ({employee.shift})
                </h2>
              </Link>
              {auth.isLoggedInAs(["ADMIN"]) && (
                <Link className="add-edit-button" to="/addEmployee" state={{ employee }}>
                  Edit
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 500, margin: "50px" }} />
      )}
    </div>
  );
};

export default EmployeeList;
