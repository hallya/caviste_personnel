export interface FormationFormData {
  name: string;
  email: string;
  message?: string;
}

export type SubmitStatus = 'idle' | 'success' | 'error';