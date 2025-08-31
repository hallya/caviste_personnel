import type { Metadata } from "next";
import ContactView from "./views/ContactView";

export const metadata: Metadata = {
  title: "Contact & À propos - Edouard, Caviste personnel",
  description:
    "Contactez Edouard pour vos besoins en vins d'exception. Caviste personnel passionné, spécialiste des vignerons français et conseils personnalisés.",
  openGraph: {
    title: "Contact & À propos - Edouard, Caviste personnel",
    description:
      "Contactez Edouard pour vos besoins en vins d'exception. Caviste personnel passionné, spécialiste des vignerons français et conseils personnalisés.",
    url: "https://caviste-personnel.vercel.app/contact",
    siteName: "Edouard, Caviste personnel",
    images: [
      {
        url: "/edouard-contact.png",
        width: 1200,
        height: 630,
        alt: "Edouard, caviste personnel spécialisé dans les vins de vignerons français",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & À propos - Edouard, Caviste personnel",
    description:
      "Contactez Edouard pour vos besoins en vins d'exception. Caviste personnel passionné, spécialiste des vignerons français et conseils personnalisés.",
    images: ["/edouard-contact.png"],
  },
};

export default function ContactPage() {
  return <ContactView />;
}
