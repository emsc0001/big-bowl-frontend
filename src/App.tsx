import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Products } from "./components/Products";
import { AirHockeys } from "./components/AirHockey";
import { BowlingLanes } from "./components/Bowling";
import { Booking } from "./components/Booking";
import { Dinner } from "./components/Dinner";
import BowlingForm from "./form/BowlingForm";
import AirHockeyForm from "./form/AirHockeyForm";
import DinnerForm from "./form/DinnerForm";
import ProductForm from "./form/ProductForm";
import BookingBowlingForm from "./form/BookingBowlingForm";
import Login from "./security/Login";
import Logout from "./security/Logout";
import OpretForm from "./security/OpretForm";
import RequireAuth from "./security/RequireAuth";
import Layout from "./Layout";
import Home from "./Home";
import "./App.css";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/airhockey" element={<AirHockeys />} />
        <Route path="/bowlinglanes" element={<BowlingLanes />} />
        <Route path="/dinner" element={<Dinner />} />

        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/bowling" element={<BookingBowlingForm />} />
        {/* <Route path="/booking/airhockey" element={<BookingAirhockey />} /> */}
        {/* <Route path="/booking/dinner" element={<BookingDinner />} /> */}

        <Route
          path="/addBowlingLane"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <BowlingForm />
            </RequireAuth>
          }
        />
        <Route
          path="/addAirHockey"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AirHockeyForm />
            </RequireAuth>
          }
        />
        <Route
          path="/addDinnerTable"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <DinnerForm />
            </RequireAuth>
          }
        />
        <Route
          path="/addProduct"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <ProductForm />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/opret" element={<OpretForm />} />
      </Routes>
    </Layout>
  );
}
