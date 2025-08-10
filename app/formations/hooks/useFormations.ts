import { useState } from "react";
import type { FormationFormData, SubmitStatus } from "../types";
import { API_ENDPOINTS } from "../constants";

export function useFormations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [formData, setFormData] = useState<FormationFormData>({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitForm = async () => {
      setIsSubmitting(true);
      setSubmitStatus("idle");

      try {
        const response = await fetch(API_ENDPOINTS.FORMATIONS_REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du formulaire");
        }

        setSubmitStatus("success");
      } catch (error) {
        console.error("Formation registration error:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    };

    submitForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    isSubmitting,
    submitStatus,
    handleSubmit,
    handleChange,
  };
}