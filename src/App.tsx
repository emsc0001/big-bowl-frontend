import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Products } from "./components/Products";
import { AirHockeys } from "./components/AirHockey";
import { BowlingLanes } from "./components/Bowling";
import { Booking } from "./components/Booking";
import { Dinner } from "./components/Dinner";
import { EmployeeList } from "./components/EmployeeList";
import AdminDashboard from "./components/AdminDashboard";
import EquipmentList from "./components/EquipmentList";
import BowlingForm from "./form/BowlingForm";
import AirHockeyForm from "./form/AirHockeyForm";
import DinnerForm from "./form/DinnerForm";
import ProductForm from "./form/ProductForm";
import BookingBowlingForm from "./form/BookingBowlingForm";
import { BookingOffers } from "./components/BookingOffers";
import BookingFinaliseForm from "./form/BookingFinaliseForm";
import BookingAirhockeyForm from "./form/BookingAirhockeyForm"
import BookingTableForm from "./form/BookingTableForm";
import EmployeeForm from "./form/EmployeeForm";
import Login from "./security/Login";
import Logout from "./security/Logout";
import OpretForm from "./security/OpretForm";
import RequireAuth from "./security/RequireAuth";
import Layout from "./Layout";
import Home from "./Home";
import "./App.css";
import BookingTableFinalise from "./form/BookingTableFinalise";

export default function App() {
  return (
      <Layout>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              {/* <Route path="/airhockey" element={<AirHockeys />} />
              <Route path="/bowlinglanes" element={<BowlingLanes />} />
              <Route path="/dinner" element={<Dinner />} /> */}
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/equipment" element={<EquipmentList />} />

              <Route
                  path="/airhockey"
                  element={
                      <RequireAuth roles={["ADMIN"]}>
                          <AirHockeys />
                      </RequireAuth>
                  }
              />

              <Route
                  path="/bowlinglanes"
                  element={
                      <RequireAuth roles={["ADMIN"]}>
                          <BowlingLanes />
                      </RequireAuth>
                  }
              />

              <Route
                  path="/dinner"
                  element={
                      <RequireAuth roles={["ADMIN"]}>
                          <Dinner />
                      </RequireAuth>
                  }
              />

              <Route path="/booking" element={<Booking />} />
              <Route path="/booking/bowling" element={<BookingBowlingForm />} />
              <Route path="/booking/airhockey" element={<BookingAirhockeyForm />} />
              <Route path="/booking/dinnerTable" element={<BookingTableForm />} />
              <Route path="/booking/dinnerTable/finalise" element={<BookingTableFinalise />} />

              <Route path="/booking/offers" element={<BookingOffers />} />
              <Route path="/booking/finalise" element={<BookingFinaliseForm />} />

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
                  path="/addEmployee"
                  element={
                      <RequireAuth roles={["ADMIN"]}>
                          <EmployeeForm />
                      </RequireAuth>
                  }
              />

              <Route
                  path="/admin"
                  element={
                      <RequireAuth roles={["ADMIN"]}>
                          <AdminDashboard />
                      </RequireAuth>
                  }
              />

              <Route
                  path="/equipment"
                  element={
                      <RequireAuth roles={["ADMIN"]}>
                          <AdminDashboard />
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
