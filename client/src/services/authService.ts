import { api } from "./api";
import { useAuthStore } from "../store/authStore";

export async function bootstrapSession() {
  try {
    const response = await api.post<{
      data: {
        user: {
          id: string;
          name: string;
          email: string;
          role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
          avatar: string | null;
          isVerified: boolean;
        };
        accessToken: string;
      };
    }>("/auth/refresh");

    const { user, accessToken } = response.data.data;
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setAccessToken(accessToken);
    return true;
  } catch {
    useAuthStore.getState().logout();
    return false;
  }
}
