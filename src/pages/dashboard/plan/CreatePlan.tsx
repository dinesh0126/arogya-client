import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";
import { useCreatePlan } from "@/hooks/usePlan";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createPlanSchema = z.object({
  plan_name: z.string().min(2, "Plan name is required"),
  price: z.number().min(0, "Price is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  plan_type: z.enum(["free", "yearly", "monthly"]),
  is_active: z.boolean(),
  auto_renew: z.boolean(),
});

type CreatePlanFormValues = z.infer<typeof createPlanSchema>;

export default function CreatePlan() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreatePlan();
  const { toast } = useToast();

  const form = useForm<CreatePlanFormValues>({
    resolver: zodResolver(createPlanSchema),
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

  const rootError = (form.formState.errors as any)?.root?.message as
    | string
    | undefined;

  const onSubmit = (values: CreatePlanFormValues) => {
    form.clearErrors();
    mutate(values as any, {
      onSuccess: () => {
        toast({
          title: "Plan created",
          description: "Subscription plan has been added successfully.",
          variant: "success",
        });
        navigate("/admin/plans");
      },
      onError: (error) => {
        const text = getErrorMessage(error, "Something went wrong!");
        form.setError("root", { type: "server", message: text });
        toast({
          title: "Plan create failed",
          description: text,
          variant: "error",
        });
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 px-2 sm:px-4">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Create Plan</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {rootError && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {rootError}
            </div>
          )}

          <div className="space-y-2">
            <Label>Plan Name</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("plan_name")}
            />
            {form.formState.errors.plan_name?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.plan_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("price", { valueAsNumber: true })}
            />
            {form.formState.errors.price?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("start_date")}
            />
            {form.formState.errors.start_date?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.start_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("end_date")}
            />
            {form.formState.errors.end_date?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.end_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Plan Type</Label>
            <select
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 text-slate-100 cursor-pointer"
              {...form.register("plan_type")}
            >
              <option value="free">Free</option>
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
            </select>
            {form.formState.errors.plan_type?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.plan_type.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={form.watch("is_active")}
              onChange={(e) => form.setValue("is_active", e.target.checked)}
            />
            <Label>Is Active</Label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={form.watch("auto_renew")}
              onChange={(e) => form.setValue("auto_renew", e.target.checked)}
            />
            <Label>Auto Renew</Label>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-xl bg-cyan-600 hover:bg-cyan-700"
          >
            {isPending ? "Creating..." : "Create Plan"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
