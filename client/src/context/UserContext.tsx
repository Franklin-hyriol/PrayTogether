"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { User } from "@/Interface/User"; // Assure-toi que le hook useFetch est importé
import useFetch from "@/hook/useFetch";
import { ApiError } from "@/Interface/Error";

// Définition du type du contexte
type UserContextType = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    isLoading: boolean;
    error: ApiError | null;
};

// Création du contexte avec une valeur par défaut
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider qui englobe l'application
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);

    // Utilisation de useFetch pour récupérer les données utilisateur
    const { fetchData, isLoading, error, response } = useFetch<User>(process.env.NEXT_PUBLIC_ENDPOINT_BASE_URL + "/api/v1/users/me", true);

    // Vérifier si un token existe dans les cookies et récupérer les données utilisateur
    useEffect(() => {
        const token = Cookies.get("accessToken");

        if (token) {
            fetchData(); // Effectue la requête pour récupérer l'utilisateur si un token est présent
        }
    }, [fetchData]);

    useEffect(() => {
        if (response) {
            setUserState(response); // Mise à jour du contexte avec les données utilisateur
        }
    }, [response]);

    const setUser = (user: User) => setUserState(user);
    const clearUser = () => setUserState(null);

    return (
        <UserContext.Provider value={{ user, setUser, clearUser, isLoading, error }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personnalisé pour accéder au contexte utilisateur
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser doit être utilisé à l'intérieur de UserProvider");
    }
    return context;
};
