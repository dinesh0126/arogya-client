import type {
  CreatePatientProfilePayload,
  CreatePatientUserPayload,
  UpdatePatientProfilePayload,
} from "@/types/patient";
import { api } from "./axios";

const extractUserId = (responseData: unknown): number => {
  const data = responseData as Record<string, unknown> | undefined;
  const nestedData = data?.data as Record<string, unknown> | undefined;
  const user = data?.user as Record<string, unknown> | undefined;
  const newUser = data?.newUser as Record<string, unknown> | undefined;
  const createdUser = data?.createdUser as Record<string, unknown> | undefined;
  const createduser = data?.createduser as Record<string, unknown> | undefined;
  const result = data?.result as Record<string, unknown> | undefined;
  const nestedUser = nestedData?.user as Record<string, unknown> | undefined;
  const nestedNewUser = nestedData?.newUser as Record<string, unknown> | undefined;
  const nestedCreatedUser = nestedData?.createdUser as
    | Record<string, unknown>
    | undefined;

  return Number(
    user?.id ??
      newUser?.id ??
      createdUser?.id ??
      createduser?.id ??
      result?.userId ??
      result?.id ??
      data?.userId ??
      data?.user_id ??
      nestedUser?.id ??
      nestedNewUser?.id ??
      nestedCreatedUser?.id ??
      nestedData?.userId ??
      nestedData?.user_id ??
      nestedData?.id ??
      0
  );
};

const extractProfileId = (responseData: unknown): number => {
  const data = responseData as Record<string, unknown> | undefined;
  const nestedData = data?.data as Record<string, unknown> | undefined;
  const profile = data?.profile as Record<string, unknown> | undefined;
  const patientProfile = data?.patientProfile as Record<string, unknown> | undefined;

  return Number(
    profile?.id ??
      patientProfile?.id ??
      data?.id ??
      data?.profileId ??
      nestedData?.id ??
      nestedData?.profileId ??
      0
  );
};

export const createPatientUserApi = async (
  payload: Omit<CreatePatientUserPayload, "role">
) => {
  const userPayload = { ...payload };
  const res = await api.post("/admin/createuser", {
    ...userPayload,
    role: "patient",
  });
  return res.data;
};

export const createPatientProfileApi = async (
  payload: CreatePatientProfilePayload
) => {
  const res = await api.post("/admin/createuserprofle", payload);
  return res.data;
};

export const updatePatientProfileApi = async ({
  profileId,
  payload,
}: {
  profileId: number;
  payload: UpdatePatientProfilePayload;
}) => {
  const res = await api.patch(`/admin/updatepatientprofile/${profileId}`, payload);
  return res.data;
};

export const fetchAllPatientsApi = async () => {
  const res = await api.get("/admin/getpatientprofile");
  return res.data;
};

export const deletePatientProfileApi = async (profileId: number) => {
  const res = await api.delete(`/admin/deletepatientprofile/${profileId}`);
  return res.data;
};

export const createPatientFlowApi = async (payload: {
  user: Omit<CreatePatientUserPayload, "role">;
  profile: Omit<CreatePatientProfilePayload, "userId">;
}) => {
  const userRes = await createPatientUserApi(payload.user);

  const userId = extractUserId(userRes);
  if (!userId) {
    throw new Error("User created but userId not found in response");
  }

  const profileRes = await createPatientProfileApi({
    ...payload.profile,
    userId,
  });

  const profileId = extractProfileId(profileRes);

  return { userRes, profileRes, userId, profileId };
};
