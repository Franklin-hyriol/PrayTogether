// components/AuthLoader.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import "./AuthLoader.scss";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

    if (loading) return (
        <div className="loader-container">
            <div className="loader-content">
                <div className="loader-spinner"></div>
                <div className="loader-logo">🙏</div>
                <h1 className="loader-text">Pray Together</h1>
            </div>
        </div>
    );

    return <>{children}</>;
}
