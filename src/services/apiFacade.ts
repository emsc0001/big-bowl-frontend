import { API_URL } from "../settings";
import { makeOptions, handleHttpErrors } from "./fetchUtils";
const CATEGORIES_URL = API_URL + "/categories";
const RECIPE_URL = API_URL + "/recipes";
const INFO_URL = API_URL + "/info";
const PRODUCT_URL = API_URL + "/products";
const BOWLING_URL = API_URL + "/BowlingLanes";
const AIRHOCKEY_URL = API_URL + "/AirHockeyTables";

interface Product {
  id: number | null;
  name: string;
  price: number;
}

interface BowlingLane {
  id: number | null;
  laneNumber: number;
  forKids: boolean;
}
interface AirHockey {
  id: number | null;
  tableNumber: number;
}

interface Recipe {
  id: number | null;
  name: string;
  category: string;
  instructions: string;
  thumb: string;
  youTube: string;
  ingredients: string;
  source: string;
}

interface Category {
  id: number | null;
  name: string;
}

interface Info {
  reference: string;
  created: string;
  info: string;
}

let products: Array<Product> = [];
let bowlingLanes: Array<BowlingLane> = [];
let airhockey: Array<AirHockey> = [];
let categories: Array<string> = [];
let recipes: Array<Recipe> = [];
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

async function getCategories(): Promise<Array<string>> {
  if (categories.length > 0) return [...categories];
  const res = await fetch(CATEGORIES_URL).then(handleHttpErrors);
  categories = [...res];
  return categories;
}

async function getRecipes(category: string | null): Promise<Array<Recipe>> {
  // if (recipes.length > 0) return [...recipes];
  console.log("category", category);
  const queryParams = category ? "?category=" + category : "";
  return fetch(RECIPE_URL + queryParams).then(handleHttpErrors);
}

async function getRecipe(id: number): Promise<Recipe> {
  //if (recipes.length > 0) return [...recipes];
  return fetch(RECIPE_URL + "/" + id).then(handleHttpErrors);
}

async function addRecipe(newRecipe: Recipe): Promise<Recipe> {
  const method = newRecipe.id ? "PUT" : "POST";
  const options = makeOptions(method, newRecipe, true);
  const URL = newRecipe.id ? `${RECIPE_URL}/${newRecipe.id}` : RECIPE_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function addCategory(newCategory: Category): Promise<Category> {
  const method = newCategory.id ? "PUT" : "POST"; // Angiv method som en streng
  const options = makeOptions(method, newCategory, true);
  const URL = newCategory.id ? `${CATEGORIES_URL}/${newCategory.id}` : CATEGORIES_URL;
  return fetch(URL, options).then(handleHttpErrors);
}

async function deleteRecipe(id: number): Promise<Recipe> {
  const options = makeOptions("DELETE", null, true);
  return fetch(`${RECIPE_URL}/${id}`, options).then(handleHttpErrors);
}

async function getInfo(): Promise<Info> {
  if (info) {
    return info;
  }
  info = (await fetch(INFO_URL).then(handleHttpErrors)) as Info;
  return info;
}

export type { Recipe, Info, Category, Product, AirHockey, BowlingLane };
// eslint-disable-next-line react-refresh/only-export-components
export {
  getCategories,
  getRecipes,
  getRecipe,
  addRecipe,
  deleteRecipe,
  getInfo,
  addCategory,
  getProduct,
  getProducts,
  getAirHockeys,
  getAirHockey,
  getBowlingLanes,
  getBowlingLane,
};
