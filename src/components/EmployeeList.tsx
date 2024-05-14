import React, { useState, useEffect } from "react";
import { getEmployees, Employee } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";

import "./EmployeeList.css";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const auth = useAuth();

  useEffect(() => {
    getEmployees().then((res) => {
      console.log("Fetched Employee List:", res);
      setEmployees(res);
    });
  }, []);

  return (
    <div className="employee-container">
      <header>
        <h1>Employee List👩‍💼👨‍💼</h1>
      </header>
      <div className="employee-list">
        {employees.map((employee, index) => (
          <li key={index} className="employee-item">
            <Link to={`/employee/${employee.id}`}>
              <h2>
                {employee.name} {employee.role}
              </h2>
            </Link>
            {auth.isLoggedInAs(["ADMIN"]) && (
              <Link className="add-edit-button" to="/addEmployee" state={{ employee }}>
                Rediger
              </Link>
            )}
          </li>
        ))}
      </div>
    </div>
  );
};
