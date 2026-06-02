import { api } from "./api";

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function submitContactMessage(input: ContactInput) {
  const response = await api.post<{ message: string }>("/contact", input);
  return response.data;
}
