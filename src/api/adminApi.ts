import type { CreateUserPayload } from "@/types/user";
import { api } from "./axios";

export const createUserApi = async (payload: CreateUserPayload) => {
  const res = await api.post("/admin/createuser", payload);
  return res.data;
};

export type AdminUserRecord = Record<string, unknown> & {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
};

export const fetchAllUsersApi = async (): Promise<AdminUserRecord[]> => {
  const res = await api.get("/admin/alluser");
  const data = res.data as any;
  const list =
    data?.users ||
    data?.data?.users ||
    data?.data ||
    data?.result ||
    data?.allUsers ||
    data;

  return Array.isArray(list) ? (list as AdminUserRecord[]) : [];
};
