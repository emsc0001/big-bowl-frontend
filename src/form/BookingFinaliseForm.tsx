import { useLocation } from "react-router-dom";
import { Booking, addBooking, getUserByUsername, SpecialUserWithoutPassword } from "../services/apiFacade";
import { useEffect, useState } from "react";

import "./BookingFinaliseForm.css";

export default function BookingFinaliseForm() {
  const location = useLocation();
  const { bookingActivity, dinnerBookingActivity, addedProducts } = location.state;
  const [user, setUser] = useState<SpecialUserWithoutPassword | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notification, setNotification] = useState({ message: "", show: false, type: "" });

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      getUserByUsername(username).then(setUser);
    }
  }, []);

  const handleConfirmBooking = async () => {
    const activities = [bookingActivity];
    if (dinnerBookingActivity) {
      activities.push(dinnerBookingActivity);
    }
    console.log("User", user);

    const booking: Booking = {
      id: null,
      activities: activities,
      products: addedProducts,
      user: user || null,
      phoneNumber: phoneNumber,
    };

    await addBooking(booking);
    setNotification({ show: true, message: "Booking Oprretet Succcesfuldt✅", type: "addedBooking" });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
      window.location.href = "/userBookings";
    }, 1900);
  };

  return (
    <div className="booking-finalise-container">
      {notification.show && notification.type === "addedBooking" && <div className="notificationOprettet">{notification.message}</div>}
      <h2>Finalise your booking here</h2>
      <h2 className="booking-activity">{bookingActivity.airHockeyTables ? "Bowling" : "Airhockey"}</h2>
      <h3 className="starTime">Start time: {new Date(bookingActivity.startTime).toLocaleTimeString()}</h3>
      <h3>End time: {new Date(bookingActivity.endTime).toLocaleTimeString()}</h3>
      {dinnerBookingActivity && (
        <div className="dinner-booking">
          <h2>Dinner</h2>
          <p>Start time: {new Date(dinnerBookingActivity.startTime).toLocaleTimeString()}</p>
          <p>End time: {new Date(dinnerBookingActivity.endTime).toLocaleTimeString()}</p>
        </div>
      )}
      <label className="phone-number-label">
        Phone Number:
        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </label>
      <button className="confirm-booking-button" onClick={handleConfirmBooking}>
        Confirm Booking
      </button>
    </div>
  );
}
