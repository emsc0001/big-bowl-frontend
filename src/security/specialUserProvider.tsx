import { API_URL } from "../settings";
import { makeOptions, handleHttpErrors } from "../services/fetchUtils";

const OPRET_URL = "https://biografaem.azurewebsites.net" + "/api/specialusers";

export interface SpecialUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface SpecialUserResponse {
  username: string;
  token: string;
  roles: string[];
}

export interface SpecialUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
}

const specialUserProvider = {
  isAuthenticated: false,
  signUp(user: SpecialUserRequest): Promise<SpecialUserResponse> {
    const options = makeOptions("POST", user);
    return fetch(OPRET_URL, options).then(handleHttpErrors);
  },
};

export default specialUserProvider;
