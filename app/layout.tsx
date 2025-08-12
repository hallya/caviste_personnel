import type { Metadata } from "next";
import "./globals.css";
import LayoutContainer from "./components/layout/containers/LayoutContainer";

export const metadata: Metadata = {
  title: "Edouard, Caviste personnel",
  description:
    "Vins de vignerons français, sélection confidentielle, conseils personnalisés, livraison sur mesure et tarifs négociés.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Edouard, Caviste personnel",
    description: "Vins de vignerons français, sélection confidentielle, conseils personnalisés, livraison sur mesure et tarifs négociés.",
    url: "https://caviste-personnel.vercel.app",
    siteName: "Edouard, Caviste personnel",
    images: [
      {
        url: "/edouard.png",
        width: 1200,
        height: 630,
        alt: "Un homme souriant tenant un verre de vin blanc dans une cave à vin, illustration stylisée.",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edouard, Caviste personnel",
    description: "Vins de vignerons français, sélection confidentielle, conseils personnalisés, livraison sur mesure et tarifs négociés.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutContainer>
      {children}
    </LayoutContainer>
  );
}
