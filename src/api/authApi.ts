// src/api/authApi.ts
import { api } from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}
export interface DashboardSummary {
  appointments: {
    total: number;
    today: number;
    confirmed: number;
    cancelled: number;
  };
  average_doctor_rating: number;
  users: {
    doctors: number;
    patients: number;
    total: number;
  };
}

export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post("/login", payload);
  return res.data;
};

export const dashboardApi = async (): Promise<DashboardSummary> => {
  const res = await api.get("/admin/summary");
  return res.data.data; // 🔥 IMPORTANT
};
