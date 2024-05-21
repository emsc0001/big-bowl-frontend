import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings, Booking, getBookingActivities, BookingActivity } from "../services/apiFacade";

import "./AdminUserBookings.css";

export const AdminUserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        // Handle errors appropriately
      });
  }, []);

  function handleBack() {
    navigate("/admin");
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="booking-container">
      <button className="buttonBack" type="button" onClick={handleBack}>
        Tilbage
      </button>
      <h1 className="header">Bruger Bookinger</h1>
      <div className="main-content booking-details">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Bruger</th>
              <th>Start Tid</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.user?.username}</td>
                <td>{booking.startTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
