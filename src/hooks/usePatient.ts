import {
  createPatientFlowApi,
  createPatientProfileApi,
  createPatientUserApi,
  deletePatientProfileApi,
  fetchAllPatientsApi,
  updatePatientProfileApi,
} from "@/api/patientApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: fetchAllPatientsApi,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatientFlowApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

export const useCreatePatientUser = () => {
  return useMutation({
    mutationFn: createPatientUserApi,
  });
};

export const useCreatePatientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatientProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePatientProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

export const useDeletePatientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatientProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};
