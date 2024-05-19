import { Link } from "react-router-dom";


export const Booking = () => {
    return (
        <div>
            <h1>Book Online</h1>
            <p>Book your next event here</p>
            <Link to="/booking/bowling">Book Bowling</Link>
            <Link to="/booking/airhockey">Book AirHockey</Link>
            <Link to="/booking/dinnerTable">Book Dinner</Link>
        </div>
    );
}