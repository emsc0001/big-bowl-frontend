import { BowlingLane, BookingActivity, getAvailableAirHockeyTables, addBookingActivity } from "../services/apiFacade";
import { useState, useEffect } from "react";
import Datetime from "react-datetime";
import { useNavigate } from "react-router-dom";
import "react-datetime/css/react-datetime.css";
import "./BookingAirhockeyForm.css";

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

export default function BookingAirhockeyForm() {
    const [airHockeyTables, setAirHockeyTables] = useState<BowlingLane[]>([]);
    const [formData, setFormData] = useState<BookingActivity>(EMPTY_BOOKINGACTIVITY);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [numTables, setNumTables] = useState(1);
    const [bookingStatus, setBookingStatus] = useState("");
    const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAvailability = async () => {
            try {
                const availableTables = await getAvailableAirHockeyTables(formData.startTime, formData.endTime);
                setAirHockeyTables(availableTables);
                console.log(availableTables);


                if (availableTables.length >= numTables) {
                    setBookingStatus("The time is available!");
                    setIsBookingSuccessful(true);
                } else {
                    setBookingStatus("The time is not available.");
                    setIsBookingSuccessful(false);
                }
            } catch (error) {
                console.error(error);
                setBookingStatus("An error occurred while checking availability.");
                setIsBookingSuccessful(false);
            }
        };

        checkAvailability();
    }, [formData]);

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });
    // };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Combine the selected lanes
        const selectedTables = airHockeyTables.slice(0, numTables);

        // Update the formData with the selected lanes
        const updatedFormData = { ...formData, airHockeyTables: selectedTables };

        console.log(updatedFormData);
        addBookingActivity(updatedFormData);
        navigate("/booking/offers", { state: { bookingActivity: updatedFormData } });
    };

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

    const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const duration = Number(e.target.value);
        const startTime = new Date(formData.startTime);
        const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
        setFormData({ ...formData, endTime: endTime.toISOString() });
    };

    const handleNumTablesChange = (event) => {
        setNumTables(event.target.value);
    };

    function handleBack() {
        navigate("/booking");
      }

    return (
        <div>
            <h2>Book Air Hockey</h2>
            <form id="bookingAirHockeyForm">
                <button onClick={handleBack}>Tilbage</button>
                <label>Dato og Tid</label>
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
                />{" "}
                <label>Varighed</label>
                <select name="duration" onChange={handleDurationChange}>
                    <option value="">Vælg Varighed</option>
                    <option value="1">1 time</option>
                    <option value="2">2 timer</option>
                </select>
                <label>Antal Borde</label>
                <select value={numTables} onChange={handleNumTablesChange}>
                    {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
                <p style={{ color: isBookingSuccessful ? "green" : "red", backgroundColor: "white" }}>{bookingStatus}</p>
                <button onClick={handleSubmit}>Videre</button>
            </form>
        </div>
    );  

}
