import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { editBooking, addBooking, deleteBooking, Booking } from "../services/apiFacade";

import "./EditBookingForm.css";

const EMPTY_BOOKING: Booking = {
  id: 0,
  activities: [],
  products: [],
  user: null,
  phoneNumber: "",
  selectedProduct: "", // Tilføj dette for at gemme værdien af det valgte produkt
};

export default function EditBookingForm() {
  const [booking, setBooking] = useState<Booking>(EMPTY_BOOKING);

  const location = useLocation();
  const navigate = useNavigate();
  const bookingToEdit = location.state?.booking || EMPTY_BOOKING;
  const [formData, setFormData] = useState<Booking>(bookingToEdit);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", show: false, type: "" });

  useEffect(() => {
    setBooking(bookingToEdit);
  }, [bookingToEdit]);

  function handleSubmit(event) {
    event.preventDefault();
    const isEditing = formData.id ? true : false;
    const action = isEditing ? editBooking : addBooking;

    const bookingData = {
      ...formData,
      activities: formData.activities || [],
    };

    action(bookingData)
      .then(() => {
        const message = isEditing ? `Updated Booking ${formData.id}🔨` : "Created A New Booking🆕";
        setNotification({ message: message, show: true, type: "addEdit" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          navigate("/userBookings");
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

  function handleProductChange(index: number, event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => {
      const updatedProducts = prev.products.map((product, i) => {
        if (i === index) {
          return {
            ...product,
            [name]: type === "checkbox" ? checked : value,
          };
        }
        return product;
      });
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  }

  function handleActivityChange(index: number, event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => {
      const updatedActivities = prev.activities.map((activity, i) => {
        if (i === index) {
          return {
            ...activity,
            [name]: type === "checkbox" ? checked : value,
          };
        }
        return activity;
      });
      return {
        ...prev,
        activities: updatedActivities,
      };
    });
  }

  function handleDelete() {
    if (!formData.id) return;

    deleteBooking(formData.id)
      .then(() => {
        setNotification({ message: `Deleted Booking ${formData.id}❌`, show: true, type: "delete" });
        setTimeout(() => {
          setNotification({ message: "", show: false, type: "" });
          navigate("/userBookings");
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

        {formData.activities.map((activity, index) => (
          <div key={index}>
            <h3>Booking time</h3>
            <label>
              Start Time:
              <input type="datetime-local" name="startTime" value={activity.startTime} onChange={(e) => handleActivityChange(index, e)} />
            </label>
            <label>
              End Time:
              <input type="datetime-local" name="endTime" value={activity.endTime} onChange={(e) => handleActivityChange(index, e)} />
            </label>
          </div>
        ))}

        <div>
          <h3>Produkter</h3>
          <label>
            Vælg produkt:
            <select name="selectedProduct" value={formData.selectedProduct} onChange={handleChange}>
              <option value="">Vælg et produkt</option>
              {formData.products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        </div>

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
