import {
  createAppointmentApi,
  fetchAllAppointmentsApi,
  cancelAppointmentApi,
  rescheduleAppointmentApi,
} from "@/api/appointmentApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAppointments = ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["appointments", page, limit, status ?? "all"],
    queryFn: () => fetchAllAppointmentsApi({ page, limit, status }),
    refetchOnMount: "always",
    staleTime: 0,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
    }: {
      appointmentId: string | number;
      payload: { user_id: number };
    }) => cancelAppointmentApi(appointmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
    }: {
      appointmentId: string | number;
      payload: { date: string; time_slot: string };
    }) => rescheduleAppointmentApi(appointmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
