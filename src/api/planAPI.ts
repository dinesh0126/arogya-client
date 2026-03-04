import type { CreatePlanPayload, FetchPlansResponse, UpdatePlanPayload } from "@/types/plan";
import { api } from "./axios";

interface UpdatePlanApiPayload {
  id: number;
  payload: UpdatePlanPayload;
}

export const createPlanApi = async (payload: CreatePlanPayload) => {
  const res = await api.post("/admin/createplan", payload);
  return res.data;
};

export const fetchPlansApi = async (): Promise<FetchPlansResponse> => {
  const res = await api.get("/admin/getplan");
  return res.data as FetchPlansResponse;
};

export const updatePlanApi = async ({ id, payload }: UpdatePlanApiPayload) => {
  const res = await api.put(`/admin/updateplan/${id}`, payload);
  return res.data;
};

export const deactivatePlanApi = async (id: number) => {
  const res = await api.put(`/admin/deactivateplan/${id}`);
  return res.data;
};

export const activatePlanApi = async (id: number) => {
  const res = await api.put(`/admin/activateplan/${id}`);
  return res.data;
};
