import { NavLink } from "react-router-dom";
import AuthStatus from "./security/AuthStatus";
import { useAuth } from "./security/AuthProvider";
import AddDropdownMenu from "./components/AddDropdownMenu";

import "./NavHeader.css";

export default function NavHeader() {
  const auth = useAuth();

  return (
    <nav>
      <ul>
        <li>
          {/* <a href="/">Home</a> */}
          <NavLink to="/">🏠Home</NavLink>
        </li>
        <li>
          {/* <a href="/categories">Categories</a> */}
          <NavLink to="/products">📦Produkter</NavLink>
        </li>

        <li>
          {/* <a href="/categories">Categories</a> */}
          <NavLink to="/bowlinglanes">🎳Bowling baner</NavLink>
        </li>

        <li>
          {/* <a href="/categories">Categories</a> */}
          <NavLink to="/airhockey">🏒AirHockey</NavLink>
        </li>

        <li>
          {/* <a href="/categories">Categories</a> */}
          <NavLink to="/airhockey">🍽️Spisning</NavLink>
        </li>

        {auth.isLoggedIn() && auth.isLoggedInAs(["ADMIN"]) && (
          <>
            <AddDropdownMenu />
          </>
        )}

        <AuthStatus />
      </ul>
    </nav>
  );
}
