import type { Viewport } from "next";
import "../globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { baseMetadata } from "../metadata";
import AuthLoader from "@/components/AuthLoader/AuthLoader";
import QueryProvider from "@/components/QueryProvider/QueryProvider";

export const metadata = baseMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};



export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <AuthLoader>
        <Header />
        <main className="main relative z-0 p-8" style={{ minHeight: "calc(100vh - 4rem - 3rem)" }}>
          {children}
        </main>
        <Footer />
      </AuthLoader>
    </QueryProvider>
  );
}
