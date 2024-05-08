import React, { useState, useEffect } from "react";
import { getMedlemmer } from "../services/apiFacade";
import "./Medlemmer.css";

interface Medlemmer {
  id: number;
  username: string;
  email: string;
  roleNames: string[];
}

const Medlemmer: React.FC = () => {
  const [medlemmer, setMedlemmer] = useState<Medlemmer[]>([]);
  const [filteredMedlemmer, setFilteredMedlemmer] = useState<Medlemmer[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getMedlemmer().then((res) => {
      setMedlemmer(res);
      setFilteredMedlemmer(res);
    });
  }, []);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter === "all") {
      setFilteredMedlemmer(medlemmer);
    } else {
      const filtered = medlemmer.filter((user) => (newFilter === "users" ? user.roleNames.includes("USER") : user.roleNames.includes("ADMIN")));
      setFilteredMedlemmer(filtered);
    }
  };

  return (
    <div className="medlemmer-container">
      <h2 className="medlemmer-header">Medlemmer</h2>
      <div className="filter-dropdown">
        <select value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="all">Alle</option>
          <option value="users">Brugere</option>
          <option value="admins">Admins</option>
        </select>
      </div>
      <table className="medlemmer-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rolle(r)</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedlemmer.map((item, index) => (
            <tr key={index}>
              <td>{item.email}</td>
              <td>{item.roleNames.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Medlemmer;
