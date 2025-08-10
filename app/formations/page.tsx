"use client";

import type { Metadata } from "next";
import FormationsView from "./views/FormationsView";
import { useFormations } from "./hooks/useFormations";

export const metadata: Metadata = {
  title: "Formations Œnologie - Edouard, Caviste personnel",
  description: "Formations personnalisées en œnologie avec Edouard. Découverte des vins, dégustations guidées et conseils d'expert pour développer votre palais.",
  openGraph: {
    title: "Formations Œnologie - Edouard, Caviste personnel",
    description: "Formations personnalisées en œnologie avec Edouard. Découverte des vins, dégustations guidées et conseils d'expert pour développer votre palais.",
    url: "https://caviste-personnel.vercel.app/formations",
    siteName: "Edouard, Caviste personnel",
    images: [
      {
        url: "/edouard-formations.png",
        width: 1200,
        height: 630,
        alt: "Edouard proposant des formations en œnologie personnalisées",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formations Œnologie - Edouard, Caviste personnel",
    description: "Formations personnalisées en œnologie avec Edouard. Découverte des vins, dégustations guidées et conseils d'expert pour développer votre palais.",
    images: ["/edouard-formation.png"],
  },
};

export default function FormationsPage() {
  const {
    formData,
    isSubmitting,
    submitStatus,
    handleSubmit,
    handleChange,
  } = useFormations();

  return (
    <FormationsView
      formData={formData}
      onSubmit={handleSubmit}
      onChange={handleChange}
      isSubmitting={isSubmitting}
      submitStatus={submitStatus}
    />
  );
}