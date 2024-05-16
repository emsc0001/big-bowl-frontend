import { useLocation } from "react-router-dom";

export default function BookingFinaliseForm() {
    const location = useLocation();
    const { bowlingBookingActivity, dinnerBookingActivity } = location.state;

    
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
        </div>
    );


}
