
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
    title: "Page not found | Pray Together",
    description: "Page not found",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
                <ToastContainer position="top-right" autoClose={1500} style={{ zIndex: 2000 }} />
            </body>
        </html>
    );
}
