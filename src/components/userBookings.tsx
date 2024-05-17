import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { getBooking, Booking } from "../services/apiFacade";
import { useAuth } from "../security/AuthProvider";

export const UserBookings = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    getBooking(1).then((res) => {
      // Pass an argument to the getBooking function
      console.log("Fetched Bookings:", res);
      setBooking(res);
    });
  }, []);

  function handleBack() {
    navigate("/products");
  }

  return (
    <div>
      <button className="buttonBack" type="button" onClick={handleBack}>
        Tilbage
      </button>
      <h1>Your Booking</h1>
      {booking ? (
        <div>
          <p>Booking ID: {booking.id}</p>
          {/* Display other properties of the booking as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
