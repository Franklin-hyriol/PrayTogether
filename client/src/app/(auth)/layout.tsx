import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Suspense } from "react";
import ComponentsLoader from "@/components/ComponentsLoader/ComponentsLoader";
import QueryProvider from "@/components/QueryProvider/QueryProvider";

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
        <main className="h-screen relative z-0 sm:mt-0 p-2 sm:p-8 bg-base-200">
            <QueryProvider>
                <Suspense fallback={<ComponentsLoader />}>
                    {children}
                </Suspense>
            </QueryProvider>
        </main>
    );
}
