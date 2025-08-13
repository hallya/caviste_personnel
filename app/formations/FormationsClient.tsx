"use client";

import FormationsView from "./views/FormationsView";
import { useFormations } from "./hooks/useFormations";

export default function FormationsClient() {
  const {
    formData,
    isSubmitting,
    handleSubmit,
    handleChange,
  } = useFormations();

  return (
    <FormationsView
      formData={formData}
      onSubmit={handleSubmit}
      onChange={handleChange}
      isSubmitting={isSubmitting}
    />
  );
}
