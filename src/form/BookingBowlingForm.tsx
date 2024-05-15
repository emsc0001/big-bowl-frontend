import { BowlingLane, BookingActivity, getAvailableBowlingLanes, addBookingActivity } from "../services/apiFacade";
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
    const [numLanes, setNumLanes] = useState(1);
    const [isChildFriendly, setIsChildFriendly] = useState(false);
    const [numChildFriendlyLanes, setNumChildFriendlyLanes] = useState(0);
    const [bookingStatus, setBookingStatus] = useState("");
    const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);

    useEffect(() => {
        const checkAvailability = async () => {
        try {
            const availableLanes = await getAvailableBowlingLanes(formData.startTime, formData.endTime);
            setBowlingLanes(availableLanes);
            console.log(availableLanes);
            

            const childFriendlyLanes = availableLanes.filter((lane) => lane.forKids);
            console.log(childFriendlyLanes);
            
            if (availableLanes.length >= numLanes && childFriendlyLanes.length >= numChildFriendlyLanes) {
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

     // Sort lanes into child-friendly and regular lanes
     const childFriendlyLanes = bowlinglanes.filter((lane) => lane.forKids);
     const regularLanes = bowlinglanes.filter((lane) => !lane.forKids);

     // Select the necessary number of lanes
     const selectedChildFriendlyLanes = childFriendlyLanes.slice(0, numChildFriendlyLanes);
     const selectedRegularLanes = regularLanes.slice(0, numLanes - numChildFriendlyLanes);

     // Combine the selected lanes
     const selectedLanes = [...selectedChildFriendlyLanes, ...selectedRegularLanes];

     // Update the formData with the selected lanes
     const updatedFormData = { ...formData, bowlingLanes: selectedLanes };

     console.log(updatedFormData);
     addBookingActivity(updatedFormData);

     // TODO: Send the updatedFormData to the server
 };

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
    
        const handleNumLanesChange = (event) => {
            setNumLanes(event.target.value);
        };

        const handleIsChildFriendlyChange = (event) => {
            setIsChildFriendly(event.target.checked);
        };

        const handleNumChildFriendlyLanesChange = (event) => {
            setNumChildFriendlyLanes(event.target.value);
    };
    
        const maxChildFriendlyLanes = Math.min(numLanes, 4);


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
                <label>Number of Lanes</label>
                <select value={numLanes} onChange={handleNumLanesChange}>
                    {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
                <label>Child Friendly</label>
                <input type="checkbox" checked={isChildFriendly} onChange={handleIsChildFriendlyChange} />
                {isChildFriendly && (
                    <>
                        <label>Number of Child Friendly Lanes</label>
                        <select value={numChildFriendlyLanes} onChange={handleNumChildFriendlyLanesChange}>
                            {/* Replace this with the actual number of available child friendly lanes */}
                            {Array.from({length: maxChildFriendlyLanes}, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                <p style={{ color: isBookingSuccessful ? "green" : "red", backgroundColor: "white" }}>{bookingStatus}</p>
                <button onClick={handleSubmit}>Book Bowling</button>
            </form>
        </div>
    );
}