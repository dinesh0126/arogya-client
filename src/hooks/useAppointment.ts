import {
  createAppointmentApi,
  fetchAppointmentBookingOptionsApi,
  fetchAllAppointmentsApi,
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

export const useAppointmentBookingOptions = () => {
  return useQuery({
    queryKey: ["appointment-booking-options"],
    queryFn: fetchAppointmentBookingOptionsApi,
    refetchOnMount: "always",
    staleTime: 0,
  });
};
