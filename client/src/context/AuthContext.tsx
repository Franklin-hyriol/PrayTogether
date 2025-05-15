"use client";
import { getMeEndpoint } from "@/endpoint/User";
import { User } from "@/Interface/User";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
    accessToken: string | null;
    setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTokenAndUser = async () => {
            try {
                const res = await fetch("/api/refresh-access");

                if (!res.ok) {

                    setLoading(false);
                    return;
                }

                const data = await res.json();
                const accessToken = data?.data?.accessToken;

                if (!accessToken) {
                    setLoading(false);
                    return;
                }

                setAccessToken(accessToken);

                const userRes = await fetch(getMeEndpoint, {
                    headers: {
                        Authorization: accessToken,
                    }
                });

                if (!userRes.ok) {

                    setLoading(false);
                    return;
                }

                const userData = await userRes.json();

                if (userData?.data) {
                    setUser(userData.data);
                }
            } catch (e) {

                console.error("Erreur auth init", e);
            } finally {
                setLoading(false);
            }
        };

        fetchTokenAndUser();
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, user, setUser, setAccessToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}