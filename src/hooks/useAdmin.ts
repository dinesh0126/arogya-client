import { createUserApi, fetchAllUsersApi } from "@/api/adminApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUserApi,
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["admin-all-users"],
    queryFn: fetchAllUsersApi,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
