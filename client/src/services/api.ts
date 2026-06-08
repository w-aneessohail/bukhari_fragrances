import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

type RetryableRequest = {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest & typeof error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const token = refreshResponse.data?.data?.accessToken as string | undefined;
        if (token) {
          useAuthStore.getState().setAccessToken(token);
        }

        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
