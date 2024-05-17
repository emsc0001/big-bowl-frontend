import { useLocation } from "react-router-dom";
import { Booking, addBooking, getUserByUsername, SpecialUserWithoutPassword } from "../services/apiFacade";
import { useEffect, useState } from "react";

export default function BookingFinaliseForm() {
    const location = useLocation();
    const { bowlingBookingActivity, dinnerBookingActivity, products } = location.state;
const [user, setUser] = useState<SpecialUserWithoutPassword | null>(null);

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            getUserByUsername(username).then(setUser);
        }
    }, []);

    const handleConfirmBooking = async () => {
        const activities = [bowlingBookingActivity];
        if (dinnerBookingActivity) {
            activities.push(dinnerBookingActivity);
        }
        console.log("User", user);
        

        const booking: Booking = {
            id: null,
            activities: activities,
            products: products, // Add any products here
            user: user || null,
        };

        await addBooking(booking);
    };

    return (
        <div>
            <h1>Finalise Booking</h1>
            <p>Finalise your booking here</p>
            <h2>Bowling</h2>
            <p>Start time: {new Date(bowlingBookingActivity.startTime).toLocaleTimeString()}</p>
            <p>End time: {new Date(bowlingBookingActivity.endTime).toLocaleTimeString()}</p>
            {dinnerBookingActivity && (
                <>
                    <h2>Dinner</h2>
                    <p>Start time: {new Date(dinnerBookingActivity.startTime).toLocaleTimeString()}</p>
                    <p>End time: {new Date(dinnerBookingActivity.endTime).toLocaleTimeString()}</p>
                </>
            )}
            <button onClick={handleConfirmBooking}>Confirm Booking</button>
        </div>
    );
}
