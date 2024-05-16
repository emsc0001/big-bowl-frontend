import { useLocation, useNavigate } from "react-router-dom";
import { BookingActivity, DinnerTable, Product, getProducts, getAvailableDinnerTables, addBookingActivity } from "../services/apiFacade";
import { useEffect, useState } from "react";


export const BookingOffers = () => {
    const location = useLocation();
    const bowlingBookingActivity = location.state.bookingActivity;
    const [dinnerTable, setDinnerTable] = useState<DinnerTable>();
    const [products, setProducts] = useState<Product[]>([]);
    const [tableIsBooked, setTableIsBooked] = useState(false);
    const [dinnerBookingActivity, setDinnerBookingActivity] = useState<BookingActivity>();
    const navigate = useNavigate();




    useEffect(() => {
        const checkAvailability = async () => {
            try {
                // Parse the endTime to a Date object
                const endTime = new Date(bowlingBookingActivity.endTime);

                // Add one hour to the endTime
                endTime.setHours(endTime.getHours() + 1);

                // Get available dinner tables from endTime and one hour ahead
                const availableTables = await getAvailableDinnerTables(bowlingBookingActivity.endTime, endTime.toISOString());
                setDinnerTable(availableTables[0]);
            } catch (error) {
                console.error(error);
            }
        };
        checkAvailability();
    }, [bowlingBookingActivity]);
    
useEffect(() => {
    getProducts()
        .then((res) => {
            console.log("Fetched Products:", res);
            setProducts(res);
        })
        .catch((error) => {
            console.error("Failed to fetch products:", error);
        });
}, []);
    

const handleTableBooking = async () => {
    if (!tableIsBooked && dinnerTable) {
        try {
            // Parse the endTime to a Date object
            const startTime = new Date(bowlingBookingActivity.endTime);

            // Add one hour to the startTime to get the endTime
            const endTime = new Date(startTime.getTime());
            endTime.setHours(endTime.getHours() + 1);

            // Create a new booking activity with the dinner table
            const newBookingActivity: BookingActivity = {
                ...bowlingBookingActivity,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                dinnerTables: [dinnerTable],
            };
            await addBookingActivity(newBookingActivity);
            console.log("Booking the dinner table");
            setTableIsBooked(true);
            setDinnerBookingActivity(newBookingActivity);
        } catch (error) {
            console.error("Failed to book the dinner table:", error);
        }
    }
};

    const handleAddProduct = (product: Product) => {
    // Handle the add product action here
        console.log("Adding product:", product);
        };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        navigate("/booking/finalise", { state: { bowlingBookingActivity, dinnerBookingActivity } });
 };

return (
    <div>
        <h1>Booking Offers</h1>
        <div>
            <p>Book Dinner Table</p>
            <p>
                Table Number: {dinnerTable?.tableNumber}, Time: {new Date(bowlingBookingActivity.endTime).toLocaleTimeString()}
            </p>
            <button onClick={handleTableBooking} disabled={tableIsBooked}>
                {tableIsBooked ? "Bord booket" : "Book"}
            </button>
        </div>

        <div>
            <p>Products</p>

            {products.slice(0, 3).map((product) => (
                <p key={product.id}>
                    {product.name}, Price: {product.price}
                    <button onClick={() => handleAddProduct(product)}>Add Product</button>
                </p>
            ))}
        </div>
        <button onClick={handleSubmit}>Færdigør bookning</button>
    </div>
);
}