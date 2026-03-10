import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecordsOverview, type RecordColumn } from "@/components/dashboard/RecordsOverview";
import { useActivatePlan, useDeactivatePlan, usePlans, useUpdatePlan } from "@/hooks/usePlan";
import type { Plan, UpdatePlanPayload } from "@/types/plan";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formatPrice = (price: string | number) => {
  const value = Number(price);
  if (Number.isNaN(value)) {
    return String(price);
  }
  return `Rs. ${value.toFixed(2)}`;
};

const getUpdatePayloadFromPlan = (plan: Plan): UpdatePlanPayload => ({
  plan_name: plan.plan_name,
  price: Number(plan.price),
  start_date: plan.start_date,
  end_date: plan.end_date,
  is_active: plan.is_active,
  auto_renew: plan.auto_renew,
  plan_type: plan.plan_type,
});

const updatePlanSchema = z.object({
  plan_name: z.string().min(2, "Plan name is required"),
  price: z.number().min(0, "Price is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  plan_type: z.enum(["free", "yearly", "monthly"]),
  is_active: z.boolean(),
  auto_renew: z.boolean(),
});

type UpdatePlanFormValues = z.infer<typeof updatePlanSchema>;

export default function AllPlans() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading, isError } = usePlans();
  const { mutate: updatePlan, isPending: isUpdatingPlan } = useUpdatePlan();
  const { mutate: deactivatePlan, isPending: isDeactivatingPlan } = useDeactivatePlan();
  const { mutate: activatePlan, isPending: isActivatingPlan } = useActivatePlan();
  const plans = useMemo(() => data?.plans ?? [], [data?.plans]);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);

  const editForm = useForm<UpdatePlanFormValues>({
    resolver: zodResolver(updatePlanSchema),
    defaultValues: {
      plan_name: "",
      price: 0,
      start_date: "",
      end_date: "",
      is_active: true,
      auto_renew: true,
      plan_type: "free",
    },
    mode: "onSubmit",
  });

  const isTogglePending = isActivatingPlan || isDeactivatingPlan;

  const openEditModal = (plan: Plan) => {
    setEditingPlanId(plan.id);
    const payload = getUpdatePayloadFromPlan(plan);
    editForm.reset({
      ...payload,
      plan_type:
        payload.plan_type === "free" || payload.plan_type === "monthly" || payload.plan_type === "yearly"
          ? payload.plan_type
          : "free",
    });
  };

  const closeEditModal = () => {
    setEditingPlanId(null);
    editForm.reset();
  };

  const togglePlanStatus = (plan: Plan) => {
    if (plan.is_active) {
      deactivatePlan(plan.id, {
        onSuccess: () => {
          toast({
            title: "Plan deactivated",
            description: `${plan.plan_name} is now inactive.`,
            variant: "success",
          });
        },
        onError: (error) => {
          toast({
            title: "Plan action failed",
            description: getErrorMessage(error, "Could not deactivate plan."),
            variant: "error",
          });
        },
      });
      return;
    }

    activatePlan(plan.id, {
      onSuccess: () => {
        toast({
          title: "Plan activated",
          description: `${plan.plan_name} is now active.`,
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Plan action failed",
          description: getErrorMessage(error, "Could not activate plan."),
          variant: "error",
        });
      },
    });
  };

  const planColumns: RecordColumn<Plan>[] = [
    {
      id: "plan_name",
      header: "Plan",
      render: (plan) => <span className="font-medium">{plan.plan_name}</span>,
    },
    {
      id: "plan_type",
      header: "Type",
      className: "text-gray-300",
      render: (plan) => plan.plan_type,
    },
    {
      id: "price",
      header: "Price",
      className: "text-gray-300",
      render: (plan) => formatPrice(plan.price),
    },
    {
      id: "duration",
      header: "Duration",
      className: "text-gray-300",
      hideOn: "lg",
      render: (plan) => `${plan.start_date} to ${plan.end_date}`,
    },
    {
      id: "status",
      header: "Status",
      render: (plan) => (
        <Badge className={plan.is_active ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
          {plan.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "auto_renew",
      header: "Auto Renew",
      render: (plan) => (
        <Badge variant="outline" className={plan.auto_renew ? "border-green-500 text-green-500" : "border-gray-400 text-gray-400"}>
          {plan.auto_renew ? "Enabled" : "Disabled"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      render: (plan) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditModal(plan)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant={plan.is_active ? "destructive" : "default"}
            onClick={() => togglePlanStatus(plan)}
            disabled={isTogglePending}
          >
            {plan.is_active ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  const renderPlanCard = (plan: Plan) => (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">{plan.plan_name}</p>
            <p className="text-xs text-gray-400">{plan.plan_type}</p>
          </div>
          <Badge className={plan.is_active ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
            {plan.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="text-sm">{formatPrice(plan.price)}</p>
        <p className="text-xs text-gray-400">
          {plan.start_date} to {plan.end_date}
        </p>
        <Badge variant="outline" className={plan.auto_renew ? "border-green-500 text-green-500" : "border-gray-400 text-gray-400"}>
          Auto Renew: {plan.auto_renew ? "Enabled" : "Disabled"}
        </Badge>
        <div className="flex items-center gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => openEditModal(plan)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant={plan.is_active ? "destructive" : "default"}
            onClick={() => togglePlanStatus(plan)}
            disabled={isTogglePending}
          >
            {plan.is_active ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <Card className="p-6 text-sm text-gray-400">Loading plans...</Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <Card className="p-6 text-sm text-red-400">
          Could not load plans. Please check plan fetch API endpoint.
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Plans</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            View all subscription plans created by admin.
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/plans/create")}
          className="gap-2 bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </Button>
      </div>

      <RecordsOverview
        title="Plan Management"
        description="Track prices, dates, and renewal status."
        items={plans}
        getRowId={(plan) => String(plan.id)}
        columns={planColumns}
        mobileCard={renderPlanCard}
        searchPlaceholder="Search plans..."
        searchFields={(plan) => [plan.plan_name, plan.plan_type, String(plan.price)]}
        emptyMessage="No plans found"
      />

      {editingPlanId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeEditModal} />
          <Card className="relative z-10 w-full max-w-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Update Plan</h2>
            <form
              className="space-y-4"
              onSubmit={editForm.handleSubmit((values) => {
                if (editingPlanId === null) return;
                editForm.clearErrors();
                updatePlan(
                  { id: editingPlanId, payload: values as unknown as UpdatePlanPayload },
                  {
                    onSuccess: () => {
                      toast({
                        title: "Plan updated",
                        description: "Plan details were saved successfully.",
                        variant: "success",
                      });
                      closeEditModal();
                    },
                    onError: (error) => {
                      const text = getErrorMessage(error, "Could not update plan.");
                      editForm.setError("root", { type: "server", message: text });
                      toast({
                        title: "Plan update failed",
                        description: text,
                        variant: "error",
                      });
                    },
                  }
                );
              })}
            >
              {(editForm.formState.errors as any)?.root?.message && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                  {(editForm.formState.errors as any).root.message as string}
                </div>
              )}

              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input
                  className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
                  {...editForm.register("plan_name")}
                />
                {editForm.formState.errors.plan_name?.message && (
                  <p className="text-xs text-rose-300">
                    {editForm.formState.errors.plan_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
                  {...editForm.register("price", { valueAsNumber: true })}
                />
                {editForm.formState.errors.price?.message && (
                  <p className="text-xs text-rose-300">{editForm.formState.errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
                  {...editForm.register("start_date")}
                />
                {editForm.formState.errors.start_date?.message && (
                  <p className="text-xs text-rose-300">
                    {editForm.formState.errors.start_date.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
                  {...editForm.register("end_date")}
                />
                {editForm.formState.errors.end_date?.message && (
                  <p className="text-xs text-rose-300">{editForm.formState.errors.end_date.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Plan Type</Label>
                <select
                  className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 text-slate-100 cursor-pointer"
                  {...editForm.register("plan_type")}
                >
                  <option value="free">Free</option>
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                </select>
                {editForm.formState.errors.plan_type?.message && (
                  <p className="text-xs text-rose-300">{editForm.formState.errors.plan_type.message}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={editForm.watch("is_active")}
                  onChange={(event) => editForm.setValue("is_active", event.target.checked)}
                />
                <Label>Is Active</Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={editForm.watch("auto_renew")}
                  onChange={(event) => editForm.setValue("auto_renew", event.target.checked)}
                />
                <Label>Auto Renew</Label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingPlan}>
                  {isUpdatingPlan ? "Updating..." : "Update Plan"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
