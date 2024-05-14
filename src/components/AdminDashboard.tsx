import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashBoard.css"; // Husk at oprette og importere denne CSS fil

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <img
          className="logo"
          src="https://i.ibb.co/9rQBkgw/DALL-E-2024-05-09-14-25-21-A-vibrant-and-modern-logo-for-a-bowling-alley-named-Big-Bowl-The-logo-inc.webp"
          alt="Big Bowl Logo"
        />
      </header>

      <main className="admin-links">
        <ul>
          <li>
            <Link to="/bowlinglanes">Se Bowling Baner</Link>
          </li>
          <li>
            <Link to="/airhockey">Se Air Hockey Borde</Link>
          </li>
          <li>
            <Link to="/dinner">Se Spise Borde</Link>
          </li>
        </ul>
      </main>

      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} Big Bowl. Alle rettigheder forbeholdes.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
