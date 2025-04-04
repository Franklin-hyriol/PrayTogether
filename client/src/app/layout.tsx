import type { Metadata, Viewport } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { UserProvider } from "@/context/UserContext";


export const metadata: Metadata = {
  title: "Pray Together",
  description: "let's pray together",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["Pray Together", "praytogether", "pray", "together"],
  authors: [
    {
      name: "Franklin Hyriol",
      url: "https://mg.linkedin.com/in/franklin-hyriol-razafinandrasana-4b9a71217",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/128x128.svg" },
    { rel: "icon", url: "icons/128x128.svg" },
  ],
};

export const viewport: Viewport = {
  width: "device-width", // Définit la largeur du viewport
  initialScale: 1,      // Échelle initiale
  themeColor: "#000000", // Couleur du thème
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="">
        <UserProvider>
          <Header />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}