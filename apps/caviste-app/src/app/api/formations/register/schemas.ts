import { z } from "zod";

export const formationRequestSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  email: z.string().email("Email invalide").max(255, "Email trop long"),
  message: z.string().max(1000, "Message trop long").optional(),
});
