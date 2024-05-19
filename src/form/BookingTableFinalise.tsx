import { useLocation } from "react-router-dom";
import { Booking, addBooking, getUserByUsername, SpecialUserWithoutPassword } from "../services/apiFacade";
import { useEffect, useState } from "react";

export default function BookingTableFinalise() {
    const location = useLocation();
    const { tableBookingActivity } = location.state;
    const [user, setUser] = useState<SpecialUserWithoutPassword | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            getUserByUsername(username).then(setUser);
        }
    }, []);

    const handleConfirmBooking = async () => {
        console.log(tableBookingActivity);
        
        const activities = [tableBookingActivity];

        const booking: Booking = {
            id: null,
            activities: activities,
            products: [],
            user: user || null,
            phoneNumber: phoneNumber,
        };

        await addBooking(booking);
    };

    return (
        <div>
            <h1>Finalise Booking</h1>
            <p>Finalise your booking here</p>
            <h2>Dinner</h2>
            {/* <p>Start time: {new Date(tableBookingActivity.startTime).toLocaleTimeString()}</p>
            <p>End time: {new Date(tableBookingActivity.endTime).toLocaleTimeString()}</p> */}
            <label>
                Phone Number:
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </label>
            <button onClick={handleConfirmBooking}>Confirm Booking</button>
        </div>
    );
}
