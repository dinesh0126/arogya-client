import { useState } from "react";
import { useCreatePlan } from "@/hooks/usePlan"; 
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

export default function CreatePlan() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreatePlan();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    plan_name: "",
    price: "",
    start_date: "",
    end_date: "",
    is_active: true,
    auto_renew: true,
    plan_type: "free",
  });

  const handleChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        ...formData,
        price: Number(formData.price),
      },
      {
        onSuccess: () => {
          toast({
            title: "Plan created",
            description: "Subscription plan has been added successfully.",
            variant: "success",
          });
          navigate("/admin/plans");
        },
        onError: (error) => {
          toast({
            title: "Plan create failed",
            description: getErrorMessage(error, "Something went wrong!"),
            variant: "error",
          });
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Create Plan</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label>Plan Name</Label>
            <Input
              value={formData.plan_name}
              onChange={(e) =>
                handleChange("plan_name", e.target.value)
              }
              required
            />
          </div>

          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                handleChange("price", e.target.value)
              }
              required
            />
          </div>

          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                handleChange("start_date", e.target.value)
              }
              required
            />
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                handleChange("end_date", e.target.value)
              }
              required
            />
          </div>

          <div>
            <Label>Plan Type</Label>
            <select
              value={formData.plan_type}
              onChange={(e) =>
                handleChange("plan_type", e.target.value)
              }
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-foreground"
            >
              <option value="free">Free</option>
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                handleChange("is_active", e.target.checked)
              }
            />
            <Label>Is Active</Label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.auto_renew}
              onChange={(e) =>
                handleChange("auto_renew", e.target.checked)
              }
            />
            <Label>Auto Renew</Label>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? "Creating..." : "Create Plan"}
          </Button>

        </form>
      </Card>
    </div>
  );
}
