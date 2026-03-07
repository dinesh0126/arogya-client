import type {
  CreateDoctorProfilePayload,
  CreateDoctorUserPayload,
} from "@/types/doctor";
import { api } from "./axios";

const extractUserId = (responseData: any): number => {
  return (
    responseData?.user?.id ||
    responseData?.createdUser?.id ||
    responseData?.userId ||
    responseData?.data?.user?.id ||
    responseData?.data?.createdUser?.id ||
    responseData?.data?.userId ||
    responseData?.data?.id ||
    0
  );
};

export const createDoctorUserApi = async (
  payload: CreateDoctorUserPayload
) => {
  const userPayload = { ...payload };
  const res = await api.post("/admin/createuser", {
    ...userPayload,
    role: payload.role,
  });
  return res.data;
};

export const createDoctorProfileApi = async (
  payload: CreateDoctorProfilePayload
) => {
  const res = await api.post("/doctor/profile", payload);
  return res.data;
};

export const createDoctorFlowApi = async (payload: {
  user: CreateDoctorUserPayload;
  profile: Omit<CreateDoctorProfilePayload, "userId">;
}) => {
  const userRes = await createDoctorUserApi(payload.user);

  const userId = extractUserId(userRes);

  if (!userId) {
    throw new Error("User created but userId not found in response");
  }

  const profileRes = await createDoctorProfileApi({
    ...payload.profile,
    userId: Number(userId),
  });

  return { userRes, profileRes, userId: Number(userId) };
};

export const fetchAllDoctors = async () => {
  const res = await api.get("/admin/getdoctorprofile");
  return res.data;
};

export const fetchPendingDoctorKycApi = async () => {
  const res = await api.get("/admin/doctor/pending");
  return res.data;
};

export const approveDoctorKycApi = async (doctorId: number) => {
  const res = await api.patch(`/admin/doctor/${doctorId}/approve`);
  return res.data;
};

export const rejectDoctorKycApi = async (doctorId: number) => {
  const res = await api.patch(`/admin/doctor/${doctorId}/reject`);
  return res.data;
};
