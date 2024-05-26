import { bookWholeDayForBowlingLanes, getBookingActivities, BookingActivity } from "../services/apiFacade";
import { Calendar, momentLocalizer, View, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";

const localizer = momentLocalizer(moment);

export default function BookWholeDay() {
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [bookingActivities, setBookingActivities] = useState<BookingActivity[]>([]);

    useEffect(() => {
        getBookingActivities()
            .then((data) => {
                const filteredData = data.filter((activity) => activity.bowlingLanes);
                setBookingActivities(filteredData);
            })
            .catch(console.error);
    }, []);

    const events = bookingActivities.map((activity) => ({
        title: "Bowling lanes booked",
        start: moment(activity.startTime).toDate(),
        end: moment(activity.endTime).toDate(),
        allDay: false,
    }));

const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    const selectedDate = moment(start).format("YYYY-MM-DD");
    const confirmBooking = window.confirm(`Are you sure you want to book the whole day for ${selectedDate}?`);

    if (confirmBooking) {
        setDate(selectedDate);
        bookWholeDayForBowlingLanes(selectedDate)
            .then(() => console.log("Successfully booked whole day for bowling lanes"))
            .catch((err) => setError(err.message));
    }
};

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
                selectable
                onSelectSlot={handleSelect}
            />
            {error && <p>{error}</p>}
        </div>
    );
}
