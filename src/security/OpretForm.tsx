import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SpecialUser } from "./specialUserProvider";

import "./OpretForm.css";

const EMPTY_USER: SpecialUser = { username: "", email: "", password: "", firstName: "", lastName: "", address: "", city: "", zipCode: "" };

export default function OpretForm() {
  const [user, setUser] = useState(EMPTY_USER);
  const navigate = useNavigate();
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErr(null);
    try {
      // Call the API to create the user
      const response = await createUser(user);

      // Check if the user was created successfully
      if (response.ok) {
        navigate("/login"); // Redirect to login page after successful sign up
      } else {
        const data = await response.json();
        setErr(data.message); // Set error message if user creation failed
      }
    } catch (error) {
      setErr("Failed to create user: " + error.message);
    }
  }

  const createUser = async (user: SpecialUser): Promise<Response> => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };

    // Ændre URL'en til den eksterne adresse
    return fetch("https://biografaem.azurewebsites.net/api/specialusers", options);
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-form" onSubmit={handleSubmit}>
        <img
          className="login-logo-form"
          src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
        ></img>

        <img
          className="logo"
          src="https://files.oaiusercontent.com/file-8glmOSoVN7HHst8vnFxeP6uW?se=2024-05-08T12%3A08%3A49Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D3dae81c2-506f-4a8f-b341-d340d690d715.webp&sig=/BHRp6h9d9xtF/KWOSSQGlwzPhJffSv5HLt9nE%2Bq88o%3D"
          alt="Big Bowl Logo"
        />
        <div className="signup-form-group">
          <label htmlFor="username">Brugernavn</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={user.email} onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))} required />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password">Adgangskode</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="firstName">Navn</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={(e) => setUser((prev) => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="lastName">Efternavn</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={(e) => setUser((prev) => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={(e) => setUser((prev) => ({ ...prev, address: e.target.value }))}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="city">By</label>
          <input type="text" name="city" value={user.city} onChange={(e) => setUser((prev) => ({ ...prev, city: e.target.value }))} required />
        </div>
        <div className="signup-form-group">
          <label htmlFor="zipCode">Postnummer</label>
          <input
            type="text"
            name="zipCode"
            value={user.zipCode}
            onChange={(e) => setUser((prev) => ({ ...prev, zipCode: e.target.value }))}
            required
          />
        </div>
        <div className="signup-form-group">
          <button type="submit">Opret Bruger</button>
        </div>

        <div className="signup-form-group">
          <Link to="/login" className="back-to-login">
            <button>Tilbage Til Login</button>
          </Link>
        </div>
        {err && <div className="signup-form-group error">{err}</div>}
      </form>
    </div>
  );
}
