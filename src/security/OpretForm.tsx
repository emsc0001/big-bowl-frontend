import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SpecialUser } from "./specialUserProvider";
import "./OpretForm.css";

const EMPTY_USER: SpecialUser = {
  username: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  zipCode: "",
};

export default function OpretForm() {
  const [user, setUser] = useState(EMPTY_USER);
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [notification, setNotification] = useState({ message: "", show: false, type: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setErr("");
    try {
      const response = await createUser(user);
      if (response.ok) {
        setNotification({ message: "Bruger oprettet succesfuldt!", show: true, type: "success" });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const data = await response.json();
        setErr(data.message);
        setNotification({ message: data.message, show: true, type: "error" });
      }
    } catch (error) {
      setErr("Failed to create user: " + error.message);
      setNotification({ message: "Failed to create user: " + error.message, show: true, type: "error" });
    }
  }

  const createUser = async (user) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };
    return fetch("http://localhost:8080/api/specialusers", options);
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-form-group">
          <label htmlFor="username">Brugernavn:</label>
          <input type="text" id="username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} required />
        </div>
        <div className="signup-form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password">Adgangskode:</label>
          <input type="password" id="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required />
        </div>
        <div className="signup-form-group">
          <label htmlFor="firstName">Fornavn:</label>
          <input type="text" id="firstName" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} required />
        </div>
        <div className="signup-form-group">
          <label htmlFor="lastName">Efternavn:</label>
          <input type="text" id="lastName" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} required />
        </div>
        <div className="signup-form-group">
          <label htmlFor="address">Adresse:</label>
          <input type="text" id="address" value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} required />
        </div>
        <div className="signup-form-group">
          <label htmlFor="city">By:</label>
          <input type="text" id="city" value={user.city} onChange={(e) => setUser({ ...user, city: e.target.value })} required />
        </div>
        <div className="signup-form-group">
          <label htmlFor="zipCode">Postnummer:</label>
          <input type="number" id="zipCode" value={user.zipCode} onChange={(e) => setUser({ ...user, zipCode: e.target.value })} required />
        </div>

        <button type="submit" className="create-btn">
          Opret Bruger
        </button>
        {err && <div className="error">{err}</div>}
      </form>
      {notification.show && <div className={`notification ${notification.type === "error" ? "error" : "success"}`}>{notification.message}</div>}
    </div>
  );
}
