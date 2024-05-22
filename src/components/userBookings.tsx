import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingsByUsername, Booking } from "../services/apiFacade";
import { useAuth } from "../security/AuthProvider";

export const UserBookings = () => {
  const auth = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.username) {
      // Ensure username is not null or undefined
      setLoading(true);
      getBookingsByUsername(auth.username)
        .then((res) => {
          setBookings(res);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching bookings for user:", auth.username, error);
          setLoading(false);
        });
    }
  }, [auth.username]); // Dependency on username to refetch if it changes

  const handleBack = () => {
    navigate("/");
  };

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
      <h1 className="header">Dine Bookinger</h1>
      <div className="main-content booking-details">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Bruger</th>
              <th>Produkt</th>
              <th>Start Tid</th>
              <th>Slut Tid</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.id}</td>
                <td>{booking.user?.username}</td>
                <td>{booking.products.map((product) => product.name).join(", ")}</td>
                <td>{formatDateTime(booking.activities[0].startTime)}</td>
                <td>{formatDateTime(booking.activities[0].endTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserBookings;
