import { useLocation, useNavigate } from "react-router-dom";
import { BookingActivity, DinnerTable, Product, getProducts, getAvailableDinnerTables, addBookingActivity } from "../services/apiFacade";
import { useEffect, useState } from "react";
import "./BookingOffers.css";

export const BookingOffers = () => {
  const location = useLocation();
  const bookingActivity = location.state.bookingActivity;
  const [dinnerTable, setDinnerTable] = useState<DinnerTable>();
  const [products, setProducts] = useState<Product[]>([]);
  const [tableIsBooked, setTableIsBooked] = useState(false);
  const [dinnerBookingActivity, setDinnerBookingActivity] = useState<BookingActivity>();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        // Parse the endTime to a Date object
        const endTime = new Date(bookingActivity.endTime);

        // Add one hour to the endTime
        endTime.setHours(endTime.getHours() + 1);

        // Get available dinner tables from endTime and one hour ahead
        const availableTables = await getAvailableDinnerTables(bookingActivity.endTime, endTime.toISOString());
        setDinnerTable(availableTables[0]);
      } catch (error) {
        console.error(error);
      }
    };
    checkAvailability();
  }, [bookingActivity]);

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
        const startTime = new Date(bookingActivity.endTime);

        // Add one hour to the startTime to get the endTime
        const endTime = new Date(startTime.getTime());
        endTime.setHours(endTime.getHours() + 1);

        // Create a new booking activity with the dinner table
        const newBookingActivity: BookingActivity = {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          dinnerTables: [dinnerTable],
        };
        // await addBookingActivity(newBookingActivity);
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

    navigate("/booking/finalise", { state: { bookingActivity, dinnerBookingActivity, products } });
  };

  function handleBack() {
    navigate("/booking/bowling");
  }

  return (
    <div className="booking-offers-container">
      <button className="buttonBack" type="button" onClick={handleBack}>
        Tilbage
      </button>
      <h1 className="bookingHeader">Booking Offers</h1>
      <div className="booking-offer">
        <p>Book Dinner Table</p>
        <p>
          Table Number: {dinnerTable?.tableNumber}, Time: {new Date(bookingActivity.endTime).toLocaleTimeString()}
        </p>
        <button className="booking-button" onClick={handleTableBooking} disabled={tableIsBooked}>
          {tableIsBooked ? "Bord booket" : "Book"}
        </button>
      </div>

      <div className="booking-offer">
        <p>Products</p>

        {products.slice(0, 3).map((product) => (
          <p key={product.id}>
            {product.name}, Price: {product.price}
            <img className="productImg" src={product.image} alt={product.name} />{" "}
            <button className="booking-button" onClick={() => handleAddProduct(product)}>
              Add Product
            </button>
          </p>
        ))}
      </div>
      <button className="booking-button" onClick={handleSubmit}>
        Færdigør bookning
      </button>
    </div>
  );
};
