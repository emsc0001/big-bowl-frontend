import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { User } from "../services/authFacade";
import "./login.css";

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await auth.signIn(user);
      setLoginSuccess(true);
      setLoginError("");
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError("Login fejlede. Kontroller venligst dine oplysninger og prøv igen.");
      setLoginSuccess(false);
    }
  };

  const handleRedirectToSignup = () => {
    navigate("/opret");
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <img
          className="login-logo-form"
          src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
          alt="user-icon"
        />

        <img
          className="logo"
          src="https://files.oaiusercontent.com/file-8glmOSoVN7HHst8vnFxeP6uW?se=2024-05-08T12%3A08%3A49Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D3dae81c2-506f-4a8f-b341-d340d690d715.webp&sig=/BHRp6h9d9xtF/KWOSSQGlwzPhJffSv5HLt9nE%2Bq88o%3D"
          alt="Big Bowl Logo"
        />
        <div className="login-form-group">
          <label htmlFor="username">Brugernavn</label>
          <input type="text" name="username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} required />
        </div>
        <div className="login-form-group">
          <label htmlFor="password">Adgangskode</label>
          <input type="password" name="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <button type="button" className="create-btn" onClick={handleRedirectToSignup}>
          Opret
        </button>
        {loginError && <div className="error-msg">{loginError}</div>}
        {loginSuccess && <div className="success-msg">Du er logget ind.</div>}
      </form>
    </div>
  );
};

export default Login;
