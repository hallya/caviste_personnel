import { Geist, Geist_Mono, Prata } from "next/font/google";
import { NotificationProvider } from "../../../contexts/NotificationContext";
import LayoutView from "../views/LayoutView";

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

interface LayoutContainerProps {
  children: React.ReactNode;
}

export default function LayoutContainer({ children }: LayoutContainerProps) {
  return (
    <LayoutView
      fontClasses={`${geistSans.variable} ${geistMono.variable} ${prata.variable} antialiased`}
      NotificationProvider={NotificationProvider}
    >
      {children}
    </LayoutView>
  );
} 