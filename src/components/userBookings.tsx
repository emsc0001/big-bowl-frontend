import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBooking, getBookingActivity, Booking, BookingActivity } from "../services/apiFacade";

export const UserBookings = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingActivity, setBookingActivity] = useState<BookingActivity | null>(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = 1; // Static ID for demonstration; replace or adapt as necessary
    setLoading(true);
    Promise.all([getBooking(bookingId), getBookingActivity(bookingId)])
      .then(([bookingRes, bookingActivityRes]) => {
        setBooking(bookingRes);
        setBookingActivity(bookingActivityRes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        // Handle errors appropriately
      });
  }, []);

  function handleBack() {
    navigate("/");
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <button className="buttonBack" type="button" onClick={handleBack}>
        Tilbage
      </button>
      <h1>Booking Details</h1>
      {booking && (
        <div>
          <p>Booking ID: {booking.id}</p>
          {booking.user && (
            <>
              <p>Brugernavn: {booking.user.username}</p>
              <p>Email: {booking.user.email}</p>
              <p>Bruger Status: {booking.user.enabled ? "Active" : "Inactive"}</p>
              <p>Rolle: {booking.user.roles.map((role) => role.roleName).join(", ")}</p>
            </>
          )}
          <h2>Booking Activities:</h2>
          {bookingActivity && (
            <>
              <p>Start Time: {bookingActivity.startTime}</p>
              <p>End Time: {bookingActivity.endTime}</p>
              <p>Bowling Baner:</p>{" "}
              {bookingActivity.bowlingLanes.map((lane) => (
                <div key={lane.id}>
                  <p>{lane.laneNumber}</p>
                  <p>{lane.forKids}</p>
                </div>
              ))}
            </>
          )}

          <h2>Products:</h2>
          {booking.products &&
            booking.products.map((product) => (
              <div key={product.id}>
                <p>
                  {product.name} - {product.price} kr
                </p>
                <img src={product.image} alt={product.name} style={{ width: "100px" }} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
