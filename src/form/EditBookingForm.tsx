import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { editBooking, deleteBooking, addBooking, getBookingsByUsername } from "../services/apiFacade";

import "./EditBookingForm.css";

const EMPTY_BOOKING = {
  id: 0,
  activities: [],
  products: [],
  user: null,
  phoneNumber: "",
};

export default function EditBookingForm() {
  const [booking, setBooking] = useState(EMPTY_BOOKING);
  const location = useLocation();
  const navigate = useNavigate();
  const bookingToEdit = location.state?.booking || EMPTY_BOOKING;
  const [formData, setFormData] = useState(bookingToEdit);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", show: false, type: "" });

  useEffect(() => {
    setBooking(bookingToEdit);
    setFormData(bookingToEdit); // Make sure formData is updated with the booking to edit
  }, [bookingToEdit]);

  function handleSubmit(event) {
    event.preventDefault();
    const isEditing = formData.id ? true : false;
    const action = isEditing ? editBooking : addBooking;

    action(formData)
      .then(() => {
        const message = isEditing ? `Updated Booking ${formData.id}🔨` : "Created A New Booking🆕";
        setNotification({ message: message, show: true, type: "addEdit" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          navigate("/userBookings");
          if (formData.user && formData.user.username) {
            getBookingsByUsername(formData.user.username).then(setBooking).catch(setError);
          }
        }, 1900);
      })
      .catch((error) => {
        setError("Error processing booking: " + error.message);
        console.error("Error processing booking:", error);
      });
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleDelete() {
    if (!formData.id) return;

    deleteBooking(formData.id)
      .then(() => {
        setNotification({ message: `Deleted Booking ${formData.id}❌`, show: true, type: "delete" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          navigate("/userBookings");
          getBookingsByUsername(formData.user.username).then(setBooking).catch(setError);
        }, 1900);
      })
      .catch((error) => {
        setError("Error deleting booking: " + error.message);
        console.error("Error deleting booking:", error);
      });
  }

  function handleBack() {
    navigate("/adminUserBookings");
  }

  return (
    <div className="booking-form">
      {notification.show && notification.type === "delete" && <div className="notificationDelete">{notification.message}</div>}
      <h2>Edit your booking here</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Booking ID:
          <input type="number" name="id" value={formData.id.toString()} onChange={handleChange} readOnly />
        </label>
        <label>
          User:
          <input type="text" name="user" value={formData.user?.username || ""} onChange={handleChange} readOnly />
        </label>
        <label>
          Phone Number:
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </form>
      <button type="button" onClick={handleBack}>
        Back
      </button>
    </div>
  );
}
