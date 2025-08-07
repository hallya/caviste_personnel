import type { Metadata } from "next";
import "./globals.css";
import LayoutContainer from "./components/layout/containers/LayoutContainer";

export const metadata: Metadata = {
  title: "Edouard, Caviste personnel",
  description:
    "Caviste personnel à Paris : vins de vignerons français, sélection confidentielle, conseils personnalisés, livraison sur mesure et tarifs négociés.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutContainer>{children}</LayoutContainer>;
}
