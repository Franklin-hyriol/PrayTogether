import type { Viewport } from "next";
import "../globals.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { baseMetadata } from "../metadata";
import AuthLoader from "@/components/AuthLoader/AuthLoader";

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
    <>
      <AuthLoader>
        <Header />
        <main className="main">{children}</main>
        <Footer />
      </AuthLoader>
    </>
  );
}
