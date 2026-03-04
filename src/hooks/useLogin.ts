// src/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
  });
};
