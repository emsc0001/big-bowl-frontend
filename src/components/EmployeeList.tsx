import React, { useState, useEffect } from "react";
import { getEmployees, Employee } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import "./EmployeeList.css";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState("all"); // Filter state for shifts
  const auth = useAuth();

  useEffect(() => {
    getEmployees().then((res) => {
      console.log("Fetched Employee List:", res);
      setEmployees(res);
    });
  }, []);

  const handleFilterChange = (shift: "all" | "morning" | "evening") => {
    setFilter(shift);
  };

  const filteredEmployees = filter === "all" ? employees : employees.filter((emp) => emp.shift === filter);

  return (
    <div className="employee-container">
      <header>
        <h1>Employee List 👩‍💼👨‍💼</h1>
        {/* Shift Filters */}
        <div>
          <button onClick={() => handleFilterChange("all")}>All</button>
          <button onClick={() => handleFilterChange("MORNING")}>Morning Shift</button>
          <button onClick={() => handleFilterChange("EVENING")}>Evening Shift</button>
        </div>
      </header>
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
    </div>
  );
};
