// src/hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/authApi";
import type { DashboardSummary } from "@/api/authApi";

export const useDashboard = () => {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardApi,
  });
};
