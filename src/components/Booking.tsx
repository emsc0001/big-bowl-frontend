import React from "react";
import { Link } from "react-router-dom";
import "./booking.css";

export const Booking = () => {
    return (
        <div className="booking-container">
            <h1 className="booking-heading">Book Online</h1>
            <p className="booking-description">Book your next event here</p>
            <div className="booking-links">
                <Link to="/booking/bowling" className="booking-link">Book Bowling</Link>
                <Link to="/booking/airhockey" className="booking-link">Book AirHockey</Link>
                <Link to="/booking/dinnerTable" className="booking-link">Book Dinner</Link>
            </div>
        </div>
    );
}
