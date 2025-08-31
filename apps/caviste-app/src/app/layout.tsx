import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Prata } from "next/font/google";
import Layout from "./components/layout/Layout";
import { JsonLd, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from "@pkg/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://caviste-personnel.vercel.app"),
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
    description:
      "Vins de vignerons français, sélection confidentielle, conseils personnalisés, livraison sur mesure et tarifs négociés.",
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
    description:
      "Vins de vignerons français, sélection confidentielle, conseils personnalisés, livraison sur mesure et tarifs négociés.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <JsonLd data={ORGANIZATION_SCHEMA} />
        <JsonLd data={WEBSITE_SCHEMA} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${prata.variable} antialiased`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
