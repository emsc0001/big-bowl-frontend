import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings, Booking } from "../services/apiFacade";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthProvider";

import "./AdminUserBookings.css";

export const AdminUserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    setLoading(true);
    getBookings()
      .then((res) => {
        setBookings(res);
        setLoading(false);
        console.log("Fetched Bookings:", res);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBookings = bookings.filter((booking) => booking.user?.username.toLowerCase().includes(searchTerm.toLowerCase()));

  function handleBack() {
    navigate("/admin");
  }

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }`;
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="booking-container">
      <button className="buttonBack" type="button" onClick={handleBack}>
        Tilbage
      </button>
      <h1 className="header">Bruger Bookinger</h1>
      <input type="text" className="search-input" placeholder="Søg efter bruger..." value={searchTerm} onChange={handleSearchChange} />
      <div className="main-content booking-details">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Bruger</th>
              <th>Start Tid</th>
              <th>Slut Tid</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.user?.username}</td>
                <td>
                  {booking.activities.map((activity, index) => (
                    <div key={index}>
                      {formatDateTime(activity.startTime)} Til {formatDateTime(activity.endTime)}
                      {auth.isLoggedInAs(["ADMIN", "USER"]) && (
                        <Link className="bowling-btn" to="/editBooking" state={{ booking: booking }}>
                          Rediger Booking
                        </Link>
                      )}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
