import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import "./AuthStatus.css";

export default function AuthStatus() {
  const auth = useAuth();

  if (!auth.isLoggedIn()) {
    return (
      <li>
        <NavLink to="/login">
          <img
            className="login-logo"
            src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
          />
        </NavLink>
      </li>
    );
  } else {
    return (
      <li>
        <Link to="/logout">Logout (Logged in as {auth.username}) </Link>
      </li>
    );
  }
}
