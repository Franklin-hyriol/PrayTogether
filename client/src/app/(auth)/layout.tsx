import type { Metadata, Viewport } from "next";
import "../globals.scss"; // garde les styles globaux

export const metadata: Metadata = {
    title: "Authentication | Pray Together",
    description: "Login or register to Pray Together",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#000000",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="auth-main">
            {children}
        </main>
    );
}
