import { API_URL } from "../settings";
import { makeOptions, handleHttpErrors } from "./fetchUtils";
const INFO_URL = API_URL + "/info";
const PRODUCT_URL = API_URL + "/products";
const BOWLING_URL = API_URL + "/BowlingLanes";
const AIRHOCKEY_URL = API_URL + "/AirHockeyTables";
const EMPLOYEE_URL = API_URL + "/employees";
const BOOKINGACTIVITY_URL = API_URL + "/booking-activities";
const BOOKING_URL = API_URL + "/bookings";
const DINNER_URL = API_URL + "/DinnerTable";

interface BowlingLane {
  id: number | null;
  laneNumber: number;
  forKids: boolean;
}

export interface Equipment {
  id: number | null;
  name: string;
  type: string;
  status: string;
  additionalDetails: string;
}

interface AirHockey {
  id: number | null;
  tableNumber: number;
}

interface DinnerTable {
  id: number | null;
  tableNumber: number;
}

interface Product {
  id: number | null;
  name: string;
  price: number;
  image: string;
}

interface Employee {
  id: number | null;
  name: string;
  role: string;
  employeeImg: string;
  shift: string;
  email: string;
  phone: number;
  shiftStart: Date;
  shiftEnd: Date;
}

interface Info {
  reference: string;
  created: string;
  info: string;
}

interface Booking {
  id: number | null;
  activities: BookingActivity[];
  products: Product[];
  user: SpecialUserWithoutPassword | null;
}
interface BookingActivity {
  id: number | null;
  startTime: string;
  endTime: string;
  activityType: string;
  bowlingLanes: BowlingLane[];
  airHockeyTables: AirHockey[];
  dinnerTables: DinnerTable[];
  booking: Booking | null;
}

interface SpecialUserWithoutPassword {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
}

let products: Array<Product> = [];
let bowlingLanes: Array<BowlingLane> = [];
let airhockey: Array<AirHockey> = [];
let dinnerTables: Array<DinnerTable> = [];
let bookings: Array<Booking> = [];
let BookingActivity: Array<BookingActivity> = [];
let Booking: Array<Booking> = [];
let employees: Array<Employee> = [];
let info: Info | null = null;

async function getProducts(): Promise<Array<Product>> {
  if (products.length > 0) return [...products];
  try {
    const res = await fetch(PRODUCT_URL);
    if (!res.ok) {
      throw new Error("Fetch request failed");
    }

    const productsData = await res.json(); // Parse responsen som JSON
    console.log("Products fetched successfully:", productsData); // Log dataene
    products = productsData; // Tildel dataene til biografer-arrayen
    return products;
  } catch (error) {
    console.log("An error occurred while fetching products:", error);
    return [];
  }
}
async function getProduct(id: number): Promise<Product> {
  return fetch(PRODUCT_URL + "/" + id).then(handleHttpErrors);
}

async function getBowlingLanes(): Promise<Array<BowlingLane>> {
  if (bowlingLanes.length > 0) return [...bowlingLanes];
  try {
    const res = await fetch(BOWLING_URL);
    if (!res.ok) {
      throw new Error("Fetch request failed");
    }

    const bowlingLanesData = await res.json(); // Parse responsen som JSON
    console.log("BowlingLanes fetched successfully:", bowlingLanesData); // Log dataene
    bowlingLanes = bowlingLanesData; // Tildel dataene til biografer-arrayen
    return bowlingLanes;
  } catch (error) {
    console.log("An error occurred while fetching bowlingLanes:", error);
    return [];
  }
}

export async function getEquipment(): Promise<Equipment[]> {
  try {
    const response = await fetch(`${API_URL}/equipment`);
    if (!response.ok) {
      throw new Error("Failed to fetch equipment");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return [];
  }
}

export async function updateEquipmentStatus(id: number, newStatus: string): Promise<Equipment> {
  const options = makeOptions("PUT", { id, status: newStatus }, true);
  const response = await fetch(`${API_URL}/equipment/${id}`, options);
  if (!response.ok) {
    throw new Error("Failed to update equipment status");
  }
  const updatedEquipment = await response.json();
  return updatedEquipment;
}

async function getBowlingLane(id: number): Promise<BowlingLane> {
  return fetch(BOWLING_URL + "/" + id).then(handleHttpErrors);
}

async function getAvailableBowlingLanes(startTime: string, endTime: string): Promise<BowlingLane[]> {
  const params = new URLSearchParams({
    startTime: startTime,
    endTime: endTime,
  });
  return fetch(`${BOWLING_URL}/available?${params.toString()}`).then(handleHttpErrors);
}
async function addBowlingLane(newBowlingLane: BowlingLane): Promise<BowlingLane> {
  const method = newBowlingLane.id ? "PUT" : "POST";
  const options = makeOptions(method, newBowlingLane, true);
  const URL = newBowlingLane.id ? `${BOWLING_URL}/${newBowlingLane.id}` : BOWLING_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function editBowlingLane(newBowlingLane: BowlingLane): Promise<BowlingLane> {
  const method = newBowlingLane.id ? "PUT" : "POST";
  const options = makeOptions(method, newBowlingLane, true);
  const URL = newBowlingLane.id ? `${BOWLING_URL}/${newBowlingLane.id}` : BOWLING_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function deleteBowlingLane(id: number): Promise<void> {
  const options = makeOptions("DELETE", null, true); // Ensure headers and method are correctly set
  return fetch(`${BOWLING_URL}/${id}`, options).then((response) => {
    if (response.ok) {
      // Handle both cases where the server might not return any content
      return response.text().then((text) => (text ? JSON.parse(text) : {}));
    } else {
      // Extract error message from response, if any
      return response.text().then((text) => {
        const error = text ? JSON.parse(text) : { message: "Failed to delete the bowling lane" };
        throw new Error(error.message);
      });
    }
  });
}

async function getAirHockeys(): Promise<Array<AirHockey>> {
  if (airhockey.length > 0) return [...airhockey];
  try {
    const res = await fetch(AIRHOCKEY_URL);
    if (!res.ok) {
      throw new Error("Fetch request failed");
    }

    const airhockeyData = await res.json(); // Parse responsen som JSON
    console.log("Airhockey fetched successfully:", airhockeyData); // Log dataene
    airhockey = airhockeyData; // Tildel dataene til biografer-arrayen
    return airhockey;
  } catch (error) {
    console.log("An error occurred while fetching airhockey:", error);
    return [];
  }
}

async function getAirHockey(id: number): Promise<AirHockey> {
  return fetch(AIRHOCKEY_URL + "/" + id).then(handleHttpErrors);
}

async function getAvailableAirHockeyTables(startTime: string, endTime: string): Promise<AirHockey[]> {
  const params = new URLSearchParams({
    startTime: startTime,
    endTime: endTime,
  });
  return fetch(`${AIRHOCKEY_URL}/available?${params.toString()}`).then(handleHttpErrors);
}

async function addAirHockey(newAirHockey: AirHockey): Promise<AirHockey> {
  const method = newAirHockey.id ? "PUT" : "POST";
  const options = makeOptions(method, newAirHockey, true);
  const URL = newAirHockey.id ? `${AIRHOCKEY_URL}/${newAirHockey.id}` : AIRHOCKEY_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function editAirHockey(newAirHockey: AirHockey): Promise<AirHockey> {
  const method = newAirHockey.id ? "PUT" : "POST";
  const options = makeOptions(method, newAirHockey, true);
  const URL = newAirHockey.id ? `${AIRHOCKEY_URL}/${newAirHockey.id}` : AIRHOCKEY_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function deleteAirHockey(id: number): Promise<void> {
  const options = makeOptions("DELETE", null, true); // Ensure headers and method are correctly set
  return fetch(`${AIRHOCKEY_URL}/${id}`, options).then((response) => {
    if (response.ok) {
      // Handle both cases where the server might not return any content
      return response.text().then((text) => (text ? JSON.parse(text) : {}));
    } else {
      // Extract error message from response, if any
      return response.text().then((text) => {
        const error = text ? JSON.parse(text) : { message: "Failed to delete the airhockey" };
        throw new Error(error.message);
      });
    }
  });
}

async function getDinnerTables(): Promise<Array<DinnerTable>> {
  if (dinnerTables.length > 0) return [...dinnerTables];
  try {
    const res = await fetch(DINNER_URL);
    if (!res.ok) {
      throw new Error("Fetch request failed");
    }

    const dinnerTablesData = await res.json(); // Parse responsen som JSON
    console.log("DinnerTables fetched successfully:", dinnerTablesData); // Log dataene
    dinnerTables = dinnerTablesData; // Tildel dataene til biografer-arrayen
    return dinnerTables;
  } catch (error) {
    console.log("An error occurred while fetching dinnerTables:", error);
    return [];
  }
}

async function getDinnerTable(id: number): Promise<DinnerTable> {
  return fetch(DINNER_URL + "/" + id).then(handleHttpErrors);
}

async function getAvailableDinnerTables(startTime: string, endTime: string): Promise<DinnerTable[]> {
  const params = new URLSearchParams({
    startTime: startTime,
    endTime: endTime,
  });
  return fetch(`${DINNER_URL}/available?${params.toString()}`).then(handleHttpErrors);
}

async function addDinnerTable(newDinnerTable: DinnerTable): Promise<DinnerTable> {
  const method = newDinnerTable.id ? "PUT" : "POST";
  const options = makeOptions(method, newDinnerTable, true);
  const URL = newDinnerTable.id ? `${DINNER_URL}/${newDinnerTable.id}` : DINNER_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function editDinnerTable(newDinnerTable: DinnerTable): Promise<DinnerTable> {
  const method = newDinnerTable.id ? "PUT" : "POST";
  const options = makeOptions(method, newDinnerTable, true);
  const URL = newDinnerTable.id ? `${DINNER_URL}/${newDinnerTable.id}` : DINNER_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function deleteDinnerTable(id: number): Promise<void> {
  const options = makeOptions("DELETE", null, true); // Ensure headers and method are correctly set
  return fetch(`${DINNER_URL}/${id}`, options).then((response) => {
    if (response.ok) {
      // Handle both cases where the server might not return any content
      return response.text().then((text) => (text ? JSON.parse(text) : {}));
    } else {
      // Extract error message from response, if any
      return response.text().then((text) => {
        const error = text ? JSON.parse(text) : { message: "Failed to delete the dinner table" };
        throw new Error(error.message);
      });
    }
  });
}

async function addProduct(newProduct: Product): Promise<Product> {
  const method = newProduct.id ? "PUT" : "POST";
  const options = makeOptions(method, newProduct, true);
  const URL = newProduct.id ? `${PRODUCT_URL}/${newProduct.id}` : PRODUCT_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function deleteProduct(id: number): Promise<Product> {
  const options = makeOptions("DELETE", null, true);
  return fetch(`${PRODUCT_URL}/${id}`, options).then(handleHttpErrors);
}

async function getInfo(): Promise<Info> {
  if (info) {
    return info;
  }
  info = (await fetch(INFO_URL).then(handleHttpErrors)) as Info;
  return info;
}

async function addBookingActivity(newBookingActivity: BookingActivity): Promise<BookingActivity> {
  const method = newBookingActivity.id ? "PUT" : "POST";
  const options = makeOptions(method, newBookingActivity);
  const URL = newBookingActivity.id ? `${BOOKINGACTIVITY_URL}/${newBookingActivity.id}` : BOOKINGACTIVITY_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function addBooking(newBooking: Booking): Promise<Booking> {
  const method = newBooking.id ? "PUT" : "POST";
  const options = makeOptions(method, newBooking);
  const URL = newBooking.id ? `${BOOKING_URL}/${newBooking.id}` : BOOKING_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function getUserByUsername(username: string): Promise<SpecialUserWithoutPassword> {
  const options = makeOptions("GET", null, true); // Assuming you want to add the token
  const response = await fetch(`${API_URL}/api/${username}`, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function getEmployees(): Promise<Array<Employee>> {
  if (employees.length > 0) return [...employees];
  try {
    const res = await fetch(EMPLOYEE_URL);
    if (!res.ok) {
      throw new Error("Fetch request failed");
    }

    const employeesData = await res.json(); // Parse responsen som JSON
    console.log("Employees fetched successfully:", employeesData); // Log dataene
    employees = employeesData; // Tildel dataene til biografer-arrayen
    return employees;
  } catch (error) {
    console.log("An error occurred while fetching employees:", error);
    return [];
  }
}

async function getEmployee(id: number): Promise<Employee> {
  return fetch(EMPLOYEE_URL + "/" + id).then(handleHttpErrors);
}

async function addEmployee(newEmployee: Employee): Promise<Employee> {
  const method = newEmployee.id ? "PUT" : "POST";
  const options = makeOptions(method, newEmployee, true);
  const URL = newEmployee.id ? `${EMPLOYEE_URL}/${newEmployee.id}` : EMPLOYEE_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function editEmployee(newEmployee: Employee): Promise<Employee> {
  const method = newEmployee.id ? "PUT" : "POST";
  const options = makeOptions(method, newEmployee, true);
  const URL = newEmployee.id ? `${EMPLOYEE_URL}/${newEmployee.id}` : EMPLOYEE_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function deleteEmployee(id: number): Promise<void> {
  const options = makeOptions("DELETE", null, true); // Ensure headers and method are correctly set
  return fetch(`${EMPLOYEE_URL}/${id}`, options).then((response) => {
    if (response.ok) {
      // Handle both cases where the server might not return any content
      return response.text().then((text) => (text ? JSON.parse(text) : {}));
    } else {
      // Extract error message from response, if any
      return response.text().then((text) => {
        const error = text ? JSON.parse(text) : { message: "Failed to delete the employee" };
        throw new Error(error.message);
      });
    }
  });
}

async function getBookings(): Promise<Array<Booking>> {
  try {
    const response = await fetch(BOOKING_URL);
    const text = await response.text(); // First, get the raw text
    console.log("Raw JSON:", text); // Log the raw JSON text
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = JSON.parse(text); // Then parse it as JSON
    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

async function getBooking(id: number): Promise<Booking> {
  return fetch(BOOKING_URL + "/" + id).then(handleHttpErrors);
}

async function editBooking(newBooking: Booking): Promise<Booking> {
  const method = newBooking.id ? "PUT" : "POST";
  const options = makeOptions(method, newBooking, true);
  const URL = newBooking.id ? `${BOOKING_URL}/${newBooking.id}` : BOOKING_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function deleteBooking(id: number): Promise<void> {
  const options = makeOptions("DELETE", null, true); // Ensure headers and method are correctly set
  return fetch(`${BOOKING_URL}/${id}`, options).then((response) => {
    if (response.ok) {
      // Handle both cases where the server might not return any content
      return response.text().then((text) => (text ? JSON.parse(text) : {}));
    } else {
      // Extract error message from response, if any
      return response.text().then((text) => {
        const error = text ? JSON.parse(text) : { message: "Failed to delete the Booking" };
        throw new Error(error.message);
      });
    }
  });
}

async function getBookingActivities(): Promise<Array<BookingActivity>> {
  if (BookingActivity.length > 0) return [...BookingActivity];
  try {
    const res = await fetch(BOOKINGACTIVITY_URL);
    if (!res.ok) {
      throw new Error("Fetch request failed");
    }

    const BookingActivityData = await res.json(); // Parse responsen som JSON
    console.log("BookingActivity fetched successfully:", BookingActivityData); // Log dataene
    BookingActivity = BookingActivityData; // Tildel dataene til biografer-arrayen
    return BookingActivity;
  } catch (error) {
    console.log("An error occurred while fetching BookingActivity:", error);
    return [];
  }
}

async function getBookingActivity(id: number): Promise<BookingActivity> {
  return fetch(BOOKINGACTIVITY_URL + "/" + id).then(handleHttpErrors);
}

async function editBookingActivity(newBookingActivity: BookingActivity): Promise<BookingActivity> {
  const method = newBookingActivity.id ? "PUT" : "POST";
  const options = makeOptions(method, newBookingActivity, true);
  const URL = newBookingActivity.id ? `${BOOKINGACTIVITY_URL}/${newBookingActivity.id}` : BOOKINGACTIVITY_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function deleteBookingActivity(id: number): Promise<void> {
  const options = makeOptions("DELETE", null, true); // Ensure headers and method are correctly set
  return fetch(`${BOOKINGACTIVITY_URL}/${id}`, options).then((response) => {
    if (response.ok) {
      // Handle both cases where the server might not return any content
      return response.text().then((text) => (text ? JSON.parse(text) : {}));
    } else {
      // Extract error message from response, if any
      return response.text().then((text) => {
        const error = text ? JSON.parse(text) : { message: "Failed to delete the BookingActivity" };
        throw new Error(error.message);
      });
    }
  });
}

export type { Product, AirHockey, BowlingLane, DinnerTable, Employee, Booking, BookingActivity, SpecialUserWithoutPassword };
// eslint-disable-next-line react-refresh/only-export-components
export {
  getInfo,
  getProduct,
  getProducts,
  getAirHockeys,
  getAirHockey,
  getBowlingLanes,
  getBowlingLane,
  getDinnerTables,
  getDinnerTable,
  getEmployees,
  getEmployee,
  getBookings,
  getBooking,
  getBookingActivities,
  getBookingActivity,
};
export { addProduct, addEmployee, addAirHockey, addBowlingLane, addDinnerTable, addBooking };
export {
  editAirHockey,
  editBowlingLane,
  editDinnerTable,
  editEmployee,
  getAvailableBowlingLanes,
  addBookingActivity,
  getAvailableAirHockeyTables,
  getAvailableDinnerTables,
  editBooking,
  getUserByUsername,
  editBookingActivity,
};
export { deleteProduct, deleteEmployee, deleteAirHockey, deleteBowlingLane, deleteDinnerTable, deleteBooking, deleteBookingActivity };
