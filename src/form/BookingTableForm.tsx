import { DinnerTable, getAvailableDinnerTables, Booking, BookingActivity, addBooking, addBookingActivity, getUserByUsername, SpecialUserWithoutPassword } from "../services/apiFacade";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./BookingTableForm.css"

const EMPTY_BOOKINGACTIVITY: BookingActivity = {
    id: null,
    startTime: "",
    endTime: "",
    activityType: "",
    bowlingLanes: [],
    airHockeyTables: [],
    dinnerTables: [],
    booking: null,
};


export default function BookingTableForm() {
    const navigate = useNavigate();
        const [formData, setFormData] = useState<BookingActivity>(EMPTY_BOOKINGACTIVITY);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [dinnerTable, setDinnerTable] = useState<DinnerTable>();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [user, setUser] = useState<SpecialUserWithoutPassword | null>(null);
    const [message, setMessage] = useState("");



    useEffect(() => {
        const checkAvailability = async () => {
            try {
        if (formData.startTime) {
            const startTimeDate = new Date(formData.startTime);
            if (isNaN(startTimeDate.getTime())) {
                // startTime is not a valid date
                return;
            }
            const endTime = new Date(formData.startTime);
            endTime.setHours(endTime.getHours() + 1);
            const availableTables = await getAvailableDinnerTables(formData.startTime, endTime.toISOString());
            setDinnerTable(availableTables[0]);
        }
            } catch (error) {
                console.error(error);
            }
        };
        checkAvailability();
    }, [formData]);

        useEffect(() => {
            const username = localStorage.getItem("username");
            if (username) {
                getUserByUsername(username).then(setUser);
            }
        }, []);
    
    const handleStartTimeChange = (moment: moment.Moment | string) => {
        if (typeof moment !== "string") {
            const value = moment.toDate();
            const now = new Date();
            const hours = value.getHours();

            // Check if the selected time is in the past or outside the 10-22 range
            if (value < now || hours < 10 || hours > 22) {
                // Invalid time, you can handle this situation as you see fit
                console.error("Invalid time selected");
            } else {
                setStartTime(value);
                setFormData({ ...formData, startTime: value.toISOString() });
            }
        }
    };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    
    try {
        const startTimeDate = new Date(formData.startTime);
        const endTimeDate = new Date(startTimeDate.getTime() + 60 * 60 * 1000); // Add one hour to startTime
        const bookingActivity: BookingActivity = {
            ...formData,
            dinnerTables: [dinnerTable],
            endTime: endTimeDate.toISOString(),
        };
    addBookingActivity(bookingActivity);
         
        setTimeout(() => {
            createbooking(bookingActivity);
        }, 1000);

        // Reset the form
        setFormData(EMPTY_BOOKINGACTIVITY);
        setPhoneNumber("");

        // Set the success message
        setMessage("Booking successful!");
    } catch (error) {
        // Set the error message
        setMessage("An error occurred while booking. Please try again.");
    }
    };
    
   const createbooking = async (createdBookingActivity) => {
        // Create the Booking
        const booking: Booking = {
            id: null,
            activities: [createdBookingActivity],
            products: [],
            user: user || null,
            phoneNumber: phoneNumber,
        };
        await addBooking(booking);
    }

    function handleBack() {
        navigate("/booking");
      }

    return (
        <div>
            <h1>Book Bord</h1>
            <form id="dinnerTableForm">
                <button onClick={handleBack}>Tilbage</button>
                <label>Dato og Tid (Åbent: 10-22)</label>
                <Datetime
                    onChange={handleStartTimeChange}
                    value={startTime}
                    dateFormat="DD-MM-YYYY"
                    timeFormat="HH:00"
                    isValidDate={(currentDate) => {
                        const now = new Date();
                        return currentDate.isAfter(now);
                    }}
                    isValidTime={(currentDate) => {
                        const hours = currentDate.hours();
                        return hours >= 10 && hours <= 22;
                    }}
                />
                <label>Antal mennesker</label>
                <input type="number" name="numberOfPeople" />
                <label>Telefonnummer:</label>
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <button onClick={handleSubmit}>Bekræft Booking</button>
                <p>{message}</p>
            </form>
        </div>
    );


}