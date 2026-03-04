import { activatePlanApi, createPlanApi, deactivatePlanApi, fetchPlansApi, updatePlanApi } from "@/api/planAPI"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useCreatePlan = () =>{
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn : createPlanApi,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["plans"] })
        },
    })
}

export const usePlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlansApi,
  })
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePlanApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
  })
}

export const useDeactivatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deactivatePlanApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
  })
}

export const useActivatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activatePlanApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
  })
}
