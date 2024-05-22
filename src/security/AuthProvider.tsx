import { createContext, useState, ReactNode } from "react";
import { authProvider, User } from "../services/authFacade";
import { useContext } from "react";
import { LoginResponse, LoginRequest } from "../services/authFacade";
// import { SpecialUser } from "./specialUserProvider";
// import { SpecialUserResponse } from "./specialUserProvider";
import React from "react";

interface AuthContextType {
  signIn: (user: LoginRequest) => Promise<User>;
  signOut: () => void;
  isLoggedIn: () => boolean;
  isLoggedInAs: (role: string[]) => boolean;
  isAdmin: () => boolean;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const initialUsername = localStorage.getItem("username") || null;
  const [username, setUsername] = useState<string | null>(initialUsername);

  const signIn = async (user_: LoginRequest) => {
    return authProvider.signIn(user_).then((user) => {
      setUsername(user.username);
      localStorage.setItem("username", user.username);
      localStorage.setItem("roles", JSON.stringify(user.roles));
      localStorage.setItem("token", user.token);
      return user;
    });
  };

  const signOut = () => {
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
  };

  const isLoggedIn = () => {
    return username != null;
  };

  const isLoggedInAs = (role: string[]) => {
    const roles: Array<string> = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles.some((r) => role.includes(r));
  };

  const isAdmin = () => {
    const roles: Array<string> = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles.includes("ADMIN");
  };

  return <AuthContext.Provider value={{ signIn, signOut, isLoggedIn, isLoggedInAs, isAdmin, username }}>{children}</AuthContext.Provider>;
}
