import { NavLink } from "react-router-dom";
import AuthStatus from "./security/AuthStatus";
import { useAuth } from "./security/AuthProvider";
import AddDropdownMenu from "./components/AddDropdownMenu";
import AdminDashBoard from "./components/AdminDashboard";

import "./NavHeader.css";

export default function NavHeader() {
  const auth = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">🏠Home</NavLink>
        </li>
        <li>
          <NavLink to="/products">📦Produkter</NavLink>
        </li>

        {/* <li>
          <NavLink to="/bowlinglanes">🎳Bowling baner</NavLink>
        </li>

        <li>
          <NavLink to="/airhockey">🏒AirHockey</NavLink>
        </li>

        <li>
          <NavLink to="/dinner">🍽️Spisning</NavLink>
        </li> */}

        {auth.isLoggedIn() && auth.isLoggedInAs(["ADMIN"]) && (
          <>
            <AddDropdownMenu />
          </>
        )}

        {auth.isLoggedIn() && auth.isLoggedInAs(["ADMIN"]) && (
          <>
            <AdminDashBoard />
          </>
        )}

        <AuthStatus />
      </ul>
    </nav>
  );
}
