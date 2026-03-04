import {
  approveDoctorKycApi,
  createDoctorFlowApi,
  createDoctorProfileApi,
  createDoctorUserApi,
  fetchAllDoctors,
  fetchPendingDoctorKycApi,
  rejectDoctorKycApi,
} from "@/api/docApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDoctorFlowApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: fetchAllDoctors,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useCreateDoctorUser = () => {
  return useMutation({
    mutationFn: createDoctorUserApi,
  });
};

export const useCreateDoctorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDoctorProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const usePendingDoctorKyc = () => {
  return useQuery({
    queryKey: ["doctor-kyc-pending"],
    queryFn: fetchPendingDoctorKycApi,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useApproveDoctorKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveDoctorKycApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-kyc-pending"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useRejectDoctorKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectDoctorKycApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-kyc-pending"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};
