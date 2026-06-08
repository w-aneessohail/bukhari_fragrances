import axios from "axios";
import { API_BASE_URL } from "./api";

export type SystemHealthResult = {
  ok: boolean;
  message: string;
  database?: "connected" | "disconnected";
};

export async function fetchSystemHealth(): Promise<SystemHealthResult> {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 8000,
      validateStatus: () => true
    });

    const database = response.data?.data?.database as string | undefined;

    if (response.status === 200 && response.data?.success && database === "connected") {
      return { ok: true, message: "Connected", database: "connected" };
    }

    return {
      ok: false,
      database: "disconnected",
      message:
        response.data?.message ??
        "Database is not available. Start PostgreSQL, then run npm run dev:server."
    };
  } catch {
    return {
      ok: false,
      message:
        "Cannot reach the API server. Start the backend (npm run dev:server) and ensure PostgreSQL is running."
    };
  }
}
