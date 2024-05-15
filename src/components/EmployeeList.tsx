import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees, Employee } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./EmployeeList.css";
import { Modal } from "./Modal";

const localizer = momentLocalizer(moment);

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const [filterShift, setFilterShift] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [viewType, setViewType] = useState("calendar"); // 'list' or 'calendar'
  const auth = useAuth();

  useEffect(() => {
    getEmployees()
      .then((data) => {
        const today = moment().format("YYYY-MM-DD"); // Use today's date for the schedule
        const mappedData = data.map((emp) => {
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

  const handleShiftChange = (e) => {
    setFilterShift(e.target.value);
  };

  const handleRoleChange = (e) => {
    setFilterRole(e.target.value);
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const filteredEmployees = employees.filter((emp) => {
    return (filterShift === "all" || emp.shift === filterShift) && (filterRole === "all" || emp.role === filterRole);
  });

  const events = filteredEmployees.map((emp) => ({
    title: `${emp.name} - ${emp.role} (${emp.shift})`,
    start: emp.shiftStart,
    end: emp.shiftEnd,
    allDay: false,
  }));

  return (
    <div className="employee-container">
      <header>
        <h1>Medarbejder Liste 👩‍💼👨‍💼</h1>
        <div>
          <button className="buttonsChange" onClick={() => setViewType("calendar")}>
            Kalender Oversigt
          </button>
          <button className="buttonsChange" onClick={() => setViewType("list")}>
            Liste Oversigt
          </button>

          {viewType === "list" && (
            <>
              <select className="filterButton" onChange={handleShiftChange}>
                <option value="all">Alle Vagter</option>
                <option value="MORNING">Morgen Vagt</option>
                <option value="EVENING">Aften Vagt</option>
              </select>
              <select className="filterButton" onChange={handleRoleChange}>
                <option value="all">Alle Roller</option>
                <option value="MANAGER">Manager</option>
                <option value="TICKET_SELLER">Billet Sælger</option>
                <option value="EQUIPMENT_OPERATOR">Udstyrsoperatør</option>
                <option value="CLEANING_STAFF">Rengøringspersonale</option>
              </select>
            </>
          )}
        </div>
      </header>
      {viewType === "list" ? (
        <ul className="employee-list">
          {filteredEmployees.map((employee) => (
            <li key={employee.id} className="employee-item" onClick={() => handleEmployeeClick(employee)}>
              <h2>
                {employee.name} - {employee.role} ({employee.shift})
              </h2>
              {auth.isLoggedInAs(["ADMIN"]) && (
                <Link className="add-edit-button" to="/addEmployee" state={{ employee }}>
                  Rediger
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 500, margin: "50px" }} />
      )}
      <Modal isOpen={modalIsOpen} onClose={closeModal}>
        {selectedEmployee && (
          <div>
            <div className="modal-profile-picture" style={{ backgroundImage: `url(${selectedEmployee.imageUrl || "default_image.jpg"})` }}></div>
            <div className="modal-header">{selectedEmployee.name}</div>
            <div className="modal-body">
              <div className="modal-header">Position: {selectedEmployee.role}</div>
              <div className="modal-header">Email: {selectedEmployee.email}</div>
              <div className="modal-header">Tlf Nummer: {selectedEmployee.phone}</div>
              <div className="modal-header">Vagt Start: {moment(selectedEmployee.shiftStart).format("HH:mm:ss")}</div>
              <div className="modal-header">Vagt Slut: {moment(selectedEmployee.shiftEnd).format("HH:mm:ss")}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeList;
