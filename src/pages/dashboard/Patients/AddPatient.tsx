import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { UserSearchSelect, type UserSearchRecord } from "@/components/dashboard/UserSearchSelect";
import { useAllUsers } from "@/hooks/useAdmin";
import { useCreatePatientProfile } from "@/hooks/usePatient";
import { getErrorMessage } from "@/lib/errors";
import type { CreatePatientProfilePayload } from "@/types/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const patientProfileSchema = z.object({
  userId: z.number().int().positive("Select a patient user"),
  emergency_contact: z.string().min(3, "Emergency contact is required"),
  preferred_language: z.string().min(2, "Preferred language is required"),
  consultation_type: z.string().min(2, "Consultation type is required"),
  blood_group: z.string().min(1, "Blood group is required"),
  allergies: z.string().min(1, "Allergies is required"),
  existing_conditions: z.string().min(1, "Existing conditions is required"),
  medications: z.string().min(1, "Medications is required"),
  age: z.number().min(0, "Age is required"),
  height: z.number().min(0, "Height is required"),
  weight: z.number().min(0, "Weight is required"),
  bmi: z.number().min(0, "BMI is required"),
  lifestyle_smoking: z.boolean(),
  lifestyle_alcohol: z.boolean(),
  insurence_provider: z.string().min(1, "Insurance provider is required"),
  policy_number: z.string().min(1, "Policy number is required"),
  payment_mode: z.string().min(1, "Payment mode is required"),
});

type PatientProfileFormValues = z.infer<typeof patientProfileSchema>;

const tryExtractFieldErrors = (error: unknown): Record<string, string> => {
  const err = error as any;
  const data = err?.response?.data ?? err?.data ?? err;

  const fieldErrors: Record<string, string> = {};

  const issues =
    data?.issues ||
    data?.error?.issues ||
    data?.errors ||
    data?.error?.errors ||
    data?.zodError?.issues;

  if (Array.isArray(issues)) {
    for (const issue of issues) {
      const path =
        (Array.isArray(issue?.path) ? issue.path[0] : issue?.path) ||
        issue?.field ||
        issue?.key;
      const message = issue?.message || issue?.msg;
      if (typeof path === "string" && typeof message === "string") {
        fieldErrors[path] = message;
      }
    }
  }

  const objectFieldErrors =
    data?.fieldErrors ||
    data?.errors?.fieldErrors ||
    data?.error?.fieldErrors ||
    data?.error?.errors?.fieldErrors;

  if (objectFieldErrors && typeof objectFieldErrors === "object") {
    for (const [key, value] of Object.entries(objectFieldErrors)) {
      if (typeof value === "string") {
        fieldErrors[key] = value;
      } else if (Array.isArray(value) && typeof value[0] === "string") {
        fieldErrors[key] = value[0];
      }
    }
  }

  return fieldErrors;
};

export default function AddPatient() {
  const { toast } = useToast();
  const { data: allUsers = [], isLoading: usersLoading } = useAllUsers();
  const { mutateAsync, isPending } = useCreatePatientProfile();

  const [selectedUser, setSelectedUser] = useState<UserSearchRecord | null>(null);

  const userOptions = useMemo<UserSearchRecord[]>(() => {
    return allUsers
      .map((u) => {
        const raw = u as any;
        const id = Number(raw?.id ?? raw?.userId ?? raw?.user_id ?? 0);
        const name = String(raw?.name ?? raw?.fullName ?? raw?.username ?? "").trim();
        const email = String(raw?.email ?? "").trim();
        const phone = raw?.phone ? String(raw.phone) : undefined;
        const role = raw?.role ? String(raw.role) : undefined;
        if (!id || !name || !email) return null;
        return { id, name, email, phone, role, raw };
      })
      .filter(Boolean) as UserSearchRecord[];
  }, [allUsers]);

  const defaultValues = useMemo<PatientProfileFormValues>(
    () => ({
      userId: 0,
      emergency_contact: "",
      preferred_language: "English",
      consultation_type: "teleconsultation",
      blood_group: "",
      allergies: "",
      existing_conditions: "",
      medications: "",
      age: 0,
      height: 0,
      weight: 0,
      bmi: 0,
      lifestyle_smoking: false,
      lifestyle_alcohol: false,
      insurence_provider: "",
      policy_number: "",
      payment_mode: "",
    }),
    []
  );

  const form = useForm<PatientProfileFormValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = async (values: PatientProfileFormValues) => {
    form.clearErrors();
    try {
      const payload: CreatePatientProfilePayload = {
        ...values,
        userId: Number(values.userId),
        age: Number(values.age),
        height: Number(values.height),
        weight: Number(values.weight),
        bmi: Number(values.bmi),
      };
      await mutateAsync(payload);
      toast({
        title: "Patient profile created",
        description: "Patient profile saved successfully.",
        variant: "success",
      });
      form.reset({ ...defaultValues, userId: values.userId });
    } catch (err) {
      const fieldErrors = tryExtractFieldErrors(err);
      for (const [key, message] of Object.entries(fieldErrors)) {
        if (key in defaultValues) {
          form.setError(key as keyof PatientProfileFormValues, {
            type: "server",
            message,
          });
        }
      }
      const text = getErrorMessage(err, "Create patient profile failed");
      form.setError("root", { type: "server", message: text });
      toast({ title: "Create failed", description: text, variant: "error" });
    }
  };

  const rootError = (form.formState.errors as any)?.root?.message as
    | string
    | undefined;

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold">Create Patient Profile</h1>
        <p className="text-sm text-slate-300">
          Select an existing patient user, then create profile via `POST /admin/createuserprofle`.
        </p>
      </div>

      <Card className="p-6">
        <UserSearchSelect
          label={`Patient User${usersLoading ? " (loading...)" : ""}`}
          users={userOptions}
          roleFilter="patient"
          value={selectedUser}
          onChange={(user) => {
            setSelectedUser(user);
            form.setValue("userId", user?.id || 0, { shouldValidate: true });
          }}
        />
        {form.formState.errors.userId?.message && (
          <p className="mt-2 text-xs text-rose-300">
            {form.formState.errors.userId.message}
          </p>
        )}
      </Card>

      <Card className="p-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-2"
        >
          {rootError && (
            <div className="md:col-span-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {rootError}
            </div>
          )}

          <div className="space-y-2">
            <Label>Emergency Contact</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("emergency_contact")}
            />
            {form.formState.errors.emergency_contact?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.emergency_contact.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Preferred Language</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("preferred_language")}
            />
            {form.formState.errors.preferred_language?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.preferred_language.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Consultation Type</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("consultation_type")}
            />
            {form.formState.errors.consultation_type?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.consultation_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Blood Group</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("blood_group")}
            />
            {form.formState.errors.blood_group?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.blood_group.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Allergies</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("allergies")}
            />
            {form.formState.errors.allergies?.message && (
              <p className="text-xs text-rose-300">{form.formState.errors.allergies.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Existing Conditions</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("existing_conditions")}
            />
            {form.formState.errors.existing_conditions?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.existing_conditions.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Medications</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("medications")}
            />
            {form.formState.errors.medications?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.medications.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Age</Label>
            <Input
              type="number"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("age", { valueAsNumber: true })}
            />
            {form.formState.errors.age?.message && (
              <p className="text-xs text-rose-300">{form.formState.errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Height (cm)</Label>
            <Input
              type="number"
              step="0.1"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("height", { valueAsNumber: true })}
            />
            {form.formState.errors.height?.message && (
              <p className="text-xs text-rose-300">{form.formState.errors.height.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              step="0.1"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("weight", { valueAsNumber: true })}
            />
            {form.formState.errors.weight?.message && (
              <p className="text-xs text-rose-300">{form.formState.errors.weight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>BMI</Label>
            <Input
              type="number"
              step="0.1"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("bmi", { valueAsNumber: true })}
            />
            {form.formState.errors.bmi?.message && (
              <p className="text-xs text-rose-300">{form.formState.errors.bmi.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={form.watch("lifestyle_smoking")}
              onChange={(e) => form.setValue("lifestyle_smoking", e.target.checked)}
            />
            <Label>Smoking</Label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={form.watch("lifestyle_alcohol")}
              onChange={(e) => form.setValue("lifestyle_alcohol", e.target.checked)}
            />
            <Label>Alcohol</Label>
          </div>

          <div className="space-y-2">
            <Label>Insurance Provider</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("insurence_provider")}
            />
            {form.formState.errors.insurence_provider?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.insurence_provider.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Policy Number</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("policy_number")}
            />
            {form.formState.errors.policy_number?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.policy_number.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Payment Mode</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("payment_mode")}
            />
            {form.formState.errors.payment_mode?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.payment_mode.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-xl bg-cyan-600 text-white hover:bg-cyan-700"
            >
              {isPending ? "Creating..." : "Create Patient Profile"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
