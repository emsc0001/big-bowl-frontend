import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBooking, getBookingActivity, getProduct, Booking, BookingActivity, Product, SpecialUserWithoutPassword } from "../services/apiFacade";

import "./userBookings.css";

export const UserBookings = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingActivity, setBookingActivity] = useState<BookingActivity | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = 1; // Static ID for demonstration; replace or adapt as necessary
    setLoading(true);
    Promise.all([getBooking(bookingId), getBookingActivity(bookingId), getProduct(bookingId)])
      .then(([bookingRes, bookingActivityRes, productRes]) => {
        setBooking(bookingRes);
        setBookingActivity(bookingActivityRes);
        setProducts([productRes]); // Fix: Pass an array of products

        setLoading(false);

        console.log("Booking:", bookingRes);
        console.log("Booking Activity:", bookingActivityRes);
        console.log("Products:", productRes);
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
    <div className="booking-container">
      <button className="buttonBack" type="button" onClick={handleBack}>
        Tilbage
      </button>
      {booking && booking.user && <h1 className="header">Velkommen {booking.user.username}!</h1>}
      {booking && (
        <div className="main-content booking-details">
          {booking.user && (
            <div className="user-details">
              <h2 className="activity-header">Booking Information:</h2>
              <h3 className="booking-id">Booking ID: {booking.id}</h3>
              <p>Brugernavn: {booking.user.username}</p>
              <p>Email: {booking.user.email}</p>
              <p>Bruger Status: {booking.user.enabled ? "Aktiv" : "Inaktiv"}</p>
              <p>Rolle: {booking.user.roles.map((role) => role.roleName).join(", ")}</p>
            </div>
          )}
          <h2 className="activity-header">Booking Tidspunkter:</h2>
          {bookingActivity && (
            <div className="activity-details">
              <p>Start Tidspunkt: {bookingActivity.startTime}</p>
              <p>Slut Tidspunkt: {bookingActivity.endTime}</p>
              <p>Bowling Baner:</p>
              {bookingActivity.bowlingLanes.map((lane) => (
                <div key={lane.id} className="lane-details">
                  <p>Bane Nummer: {lane.laneNumber}</p>
                  <p>For Børn: {lane.forKids ? "Ja" : "Nej"}</p>
                </div>
              ))}
            </div>
          )}
          <h2 className="product-header">Medkøbte Produkter:</h2>
          {products.length > 0 &&
            products.map((product) => (
              <div key={product.id} className="product-details">
                <p>
                  {product.name} - {product.price} kr
                </p>
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
