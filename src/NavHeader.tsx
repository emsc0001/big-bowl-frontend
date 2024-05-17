import { NavLink } from "react-router-dom";
import AuthStatus from "./security/AuthStatus";
import { useAuth } from "./security/AuthProvider";
import AddDropdownMenu from "./components/AddDropdownMenu";
import AdminDashboard from "./components/AdminDashboard";

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

        <li>
          <NavLink to="/admin">Admin Dashboard</NavLink>
        </li>

        {/* <li>
          <NavLink to="/bowlinglanes">🎳Bowling baner</NavLink>
        </li>

        <li>
          <NavLink to="/airhockey">🏒AirHockey</NavLink>
        </li>

        <li>
          <NavLink to="/dinner">🍽️Spisning</NavLink>
        </li>
*/}
        <li>
          <NavLink to="/booking">Book Online</NavLink>
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
