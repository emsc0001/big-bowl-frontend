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
  const [filterShift, setFilterShift] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("list"); // 'list' or 'calendar'
  const auth = useAuth();

  useEffect(() => {
    getEmployees()
      .then((data) => {
        const today = moment().format("YYYY-MM-DD"); // Use today's date for the schedule
        const mappedData = data.map((emp) => {
          let shiftStart, shiftEnd;
          if (emp.shift === "MORNING") {
            shiftStart = moment(`${today}T09:00:00`).toDate();
            shiftEnd = moment(`${today}T16:00:00`).toDate();
          } else if (emp.shift === "EVENING") {
            shiftStart = moment(`${today}T16:00:00`).toDate();
            shiftEnd = moment(`${today}T24:00:00`).toDate();
          }
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

  const handleShiftChange = (e) => {
    setFilterShift(e.target.value);
  };

  const handleRoleChange = (e) => {
    setFilterRole(e.target.value);
  };

  const filteredEmployees = employees.filter((emp) => {
    return (filterShift === "all" || emp.shift === filterShift) && (filterRole === "all" || emp.role === filterRole);
  });

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
          {viewType === "list" && (
            <>
              <select className="filterButton" onChange={handleShiftChange}>
                <option value="all">All Shifts</option>
                <option value="MORNING">Morning Shift</option>
                <option value="EVENING">Evening Shift</option>
              </select>
              <select className="filterButton" onChange={handleRoleChange}>
                <option value="all">All Roles</option>
                <option value="MANAGER">Manager</option>
                <option value="TICKET_SELLER">Ticket Seller</option>
                <option value="EQUIPMENT_OPERATOR">Equipment Operator</option>
                <option value="CLEANING_STAFF">Cleaning Staff</option>
              </select>
            </>
          )}
        </div>
      </header>
      {viewType === "list" ? (
        <ul className="employee-list">
          {filteredEmployees.map((employee, index) => (
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
