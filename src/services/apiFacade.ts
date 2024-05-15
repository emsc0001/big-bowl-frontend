import { API_URL } from "../settings";
import { makeOptions, handleHttpErrors } from "./fetchUtils";
const INFO_URL = API_URL + "/info";
const PRODUCT_URL = API_URL + "/products";
const BOWLING_URL = API_URL + "/BowlingLanes";
const AIRHOCKEY_URL = API_URL + "/AirHockeyTables";
const DINNER_URL = API_URL + "/DinnerTable";
const BOOKINGACTIVITY_URL = API_URL + "/booking-activities";

interface BowlingLane {
  id: number | null;
  laneNumber: number;
  forKids: boolean;
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

interface Info {
  reference: string;
  created: string;
  info: string;
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

interface Booking {
    id: number | null;
    activities: BookingActivity[];
    products: Product[];
    user: null;
}

let products: Array<Product> = [];
let bowlingLanes: Array<BowlingLane> = [];
let airhockey: Array<AirHockey> = [];
let dinnerTables: Array<DinnerTable> = [];
let BookingActivity: Array<BookingActivity> = [];
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

export type { Product, AirHockey, BowlingLane, DinnerTable, Booking, BookingActivity};
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
  addBowlingLane,
  editBowlingLane,
  deleteBowlingLane,
  addAirHockey,
  editAirHockey,
  deleteAirHockey,
  addDinnerTable,
  editDinnerTable,
  deleteDinnerTable,
  getAvailableBowlingLanes,
  addBookingActivity
};
export { addProduct };
export { deleteProduct };
