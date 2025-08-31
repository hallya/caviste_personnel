import { useState } from "react";
import { useNotification, NOTIFICATION_TYPES } from "@pkg/notifications";
import { API_ENDPOINTS, NOTIFICATION_CONFIG } from "../constants";
import type { FormationFormData } from "../types";

const INITIAL_FORM_DATA: FormationFormData = {
  name: "",
  email: "",
  message: "",
};

export function useFormations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] =
    useState<FormationFormData>(INITIAL_FORM_DATA);
  const { showNotification } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitForm = async () => {
      setIsSubmitting(true);

      showNotification({
        id: NOTIFICATION_CONFIG.LOADING_ID,
        type: NOTIFICATION_TYPES.LOADING,
        title: "Envoi en cours...",
        message: "Votre demande de formation est en cours d'envoi",
        autoClose: false,
      });

      try {
        const response = await fetch(API_ENDPOINTS.FORMATIONS_REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        showNotification({
          replaceId: NOTIFICATION_CONFIG.LOADING_ID,
          type: NOTIFICATION_TYPES.SUCCESS,
          title: "Demande envoyée !",
          message:
            "Votre demande a été envoyée avec succès. Je vous recontacterai rapidement.",
          autoClose: true,
          autoCloseDelay: NOTIFICATION_CONFIG.AUTO_CLOSE_DELAY,
        });

        setFormData(INITIAL_FORM_DATA);
      } catch (error) {
        console.error("Formation registration error:", error);

        showNotification({
          replaceId: NOTIFICATION_CONFIG.LOADING_ID,
          type: NOTIFICATION_TYPES.ERROR,
          title: "Erreur d'envoi",
          message:
            "Une erreur s'est produite. Veuillez réessayer ou me contacter directement.",
          autoClose: true,
          autoCloseDelay: NOTIFICATION_CONFIG.ERROR_AUTO_CLOSE_DELAY,
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    submitForm();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    isSubmitting,
    handleSubmit,
    handleChange,
  };
}
