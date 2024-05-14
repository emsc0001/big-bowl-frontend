import { BowlingLane, BookingActivity, getAvailableBowlingLanes } from "../services/apiFacade";
import { useState, useEffect } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import"./bookingBowlingForm.css"

const EMPTY_BOOKINGACTIVITY: BookingActivity = {
    id: null,
    startTime: "",
    endTime: "",
    activityType: "",
    bowlingLanes: [],
    airHockeyTables: [],
    dinnerTables: [],
    booking: null
};


export default function BookingBowlingForm() {
    const [bowlinglanes, setBowlingLanes] = useState<BowlingLane[]>([]);
    const [numberOfBowlers, setNumberOfBowlers] = useState<number>(0);
    const [formData, setFormData] = useState<BookingActivity>(EMPTY_BOOKINGACTIVITY);
    const [startTime, setStartTime] = useState<Date>(new Date());

    useEffect(() => {
        if (formData.startTime && formData.endTime) {
            getAvailableBowlingLanes(formData.startTime, formData.endTime).then((res) => setBowlingLanes(res));            
        }
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(formData);
    }

    const handleStartTimeChange = (moment: moment.Moment | string) => {
        if (typeof moment !== "string") {
            const value = moment.toDate();
            setStartTime(value);
            setFormData({ ...formData, startTime: value.toISOString() });
        }
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const duration = Number(e.target.value);
            const startTime = new Date(formData.startTime);
            const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
            setFormData({ ...formData, endTime: endTime.toISOString() });
        };

    return (
        <div>
            <h2>Book Bowling</h2>
            <form id="bookingBowlingForm">
                <label>Date and Time</label>
                <Datetime onChange={handleStartTimeChange} value={startTime} dateFormat="YYYY-MM-DD" timeFormat="HH:00" />
                <label>Duration</label>
                <select name="duration" onChange={handleDurationChange}>
                    <option value="">Select Duration</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                </select>
                <label>Number of bowlers</label>
                <input name="numberOfBowlers" type="number" value={numberOfBowlers} onChange={(e) => setNumberOfBowlers(+e.target.value)} />
                <label>Bowling Lane</label>
                <select name="bowlingLanes" value={formData.bowlingLanes} onChange={handleChange}>
                    <option value="">Select Bowling Lane</option>
                    {bowlinglanes.map((lane, index) => (
                        <option key={index} value={lane.id}>
                            {lane.laneNumber}
                        </option>
                    ))}
                </select>
                <button onClick={handleSubmit}>Book Bowling</button>
            </form>
        </div>
    );
}