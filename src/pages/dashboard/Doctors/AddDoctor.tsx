import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { UserSearchSelect, type UserSearchRecord } from "@/components/dashboard/UserSearchSelect";
import { useAllUsers } from "@/hooks/useAdmin";
import { useCreateDoctorProfile } from "@/hooks/useDoctor";
import { getErrorMessage } from "@/lib/errors";
import type { CreateDoctorProfilePayload } from "@/types/doctor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const doctorProfileSchema = z.object({
  userId: z.number().int().positive("Select a doctor user"),
  specialization: z.string().min(2, "Specialization is required"),
  qualification: z.string().min(2, "Qualification is required"),
  experienceYears: z.number().min(0, "Experience is required"),
  languagesSpoken: z.string().min(2, "Languages is required"),
  consultationTypes: z.string().min(2, "Consultation types is required"),
  consultationFee: z.number().min(0, "Consultation fee is required"),
  workStartTime: z.string().min(1, "Work start time is required"),
  workEndTime: z.string().min(1, "Work end time is required"),
  availableDays: z.string().min(2, "Available days is required"),
  timezone: z.string().min(2, "Timezone is required"),
  clinicName: z.string().min(2, "Clinic name is required"),
  clinicAddress: z.string().min(2, "Clinic address is required"),
  teleconsultationAvailable: z.boolean(),
  emergencySupport: z.boolean(),
  registrationNumber: z.string().min(2, "Registration number is required"),
  councilName: z.string().min(2, "Council name is required"),
  verificationDoc: z.string().min(4, "Verification doc URL is required"),
  govtIdDoc: z.string().min(4, "Govt ID doc URL is required"),
  bankAccount: z.string().min(4, "Bank account is required"),
  panCard: z.string().min(4, "PAN card is required"),
});

type DoctorProfileFormValues = z.infer<typeof doctorProfileSchema>;

const parseCommaList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

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

export default function AddDoctor() {
  const { toast } = useToast();
  const { data: allUsers = [], isLoading: usersLoading } = useAllUsers();
  const { mutateAsync, isPending } = useCreateDoctorProfile();

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

  const defaultValues = useMemo<DoctorProfileFormValues>(
    () => ({
      userId: 0,
      specialization: "General",
      qualification: "",
      experienceYears: 0,
      languagesSpoken: "",
      consultationTypes: "tele, manual",
      consultationFee: 0,
      workStartTime: "09:00",
      workEndTime: "18:00",
      availableDays: "Mon, Wed, Fri",
      timezone: "Asia/Kolkata",
      clinicName: "",
      clinicAddress: "",
      teleconsultationAvailable: true,
      emergencySupport: true,
      registrationNumber: "",
      councilName: "",
      verificationDoc: "",
      govtIdDoc: "",
      bankAccount: "",
      panCard: "",
    }),
    []
  );

  const form = useForm<DoctorProfileFormValues>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = async (values: DoctorProfileFormValues) => {
    form.clearErrors();
    try {
      const payload: CreateDoctorProfilePayload = {
        userId: Number(values.userId),
        specialization: values.specialization,
        qualification: values.qualification,
        experienceYears: Number(values.experienceYears),
        languagesSpoken: values.languagesSpoken,
        consultationTypes: parseCommaList(values.consultationTypes),
        consultationFee: Number(values.consultationFee),
        workStartTime: values.workStartTime,
        workEndTime: values.workEndTime,
        availableDays: parseCommaList(values.availableDays),
        timezone: values.timezone,
        clinicName: values.clinicName,
        clinicAddress: values.clinicAddress,
        teleconsultationAvailable: values.teleconsultationAvailable,
        emergencySupport: values.emergencySupport,
        registrationNumber: values.registrationNumber,
        councilName: values.councilName,
        verificationDoc: values.verificationDoc,
        govtIdDoc: values.govtIdDoc,
        bankAccount: values.bankAccount,
        panCard: values.panCard,
      };

      await mutateAsync(payload);
      toast({
        title: "Doctor profile created",
        description: "Doctor profile saved successfully.",
        variant: "success",
      });
      form.reset({ ...defaultValues, userId: values.userId });
    } catch (err) {
      const fieldErrors = tryExtractFieldErrors(err);
      for (const [key, message] of Object.entries(fieldErrors)) {
        if (key in defaultValues) {
          form.setError(key as keyof DoctorProfileFormValues, {
            type: "server",
            message,
          });
        }
      }
      const text = getErrorMessage(err, "Create doctor profile failed");
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
        <h1 className="text-2xl sm:text-3xl font-bold">Create Doctor Profile</h1>
       
      </div>

      <Card className="p-6">
        <UserSearchSelect
          label={`Doctor User${usersLoading ? " (loading...)" : ""}`}
          users={userOptions}
          roleFilter="doctor"
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
            <Label>Specialization</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("specialization")}
            />
            {form.formState.errors.specialization?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.specialization.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Qualification</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("qualification")}
            />
            {form.formState.errors.qualification?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.qualification.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Experience (years)</Label>
            <Input
              type="number"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("experienceYears", { valueAsNumber: true })}
            />
            {form.formState.errors.experienceYears?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.experienceYears.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Consultation Fee</Label>
            <Input
              type="number"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("consultationFee", { valueAsNumber: true })}
            />
            {form.formState.errors.consultationFee?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.consultationFee.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Languages Spoken</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("languagesSpoken")}
            />
            {form.formState.errors.languagesSpoken?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.languagesSpoken.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Consultation Types (comma separated)</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("consultationTypes")}
            />
            {form.formState.errors.consultationTypes?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.consultationTypes.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Work Start Time</Label>
            <Input
              type="time"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("workStartTime")}
            />
            {form.formState.errors.workStartTime?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.workStartTime.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Work End Time</Label>
            <Input
              type="time"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("workEndTime")}
            />
            {form.formState.errors.workEndTime?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.workEndTime.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Available Days (comma separated)</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("availableDays")}
            />
            {form.formState.errors.availableDays?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.availableDays.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Timezone</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("timezone")}
            />
            {form.formState.errors.timezone?.message && (
              <p className="text-xs text-rose-300">{form.formState.errors.timezone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Clinic Name</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("clinicName")}
            />
            {form.formState.errors.clinicName?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.clinicName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Clinic Address</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("clinicAddress")}
            />
            {form.formState.errors.clinicAddress?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.clinicAddress.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={form.watch("teleconsultationAvailable")}
              onChange={(e) => form.setValue("teleconsultationAvailable", e.target.checked)}
            />
            <Label>Teleconsultation Available</Label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={form.watch("emergencySupport")}
              onChange={(e) => form.setValue("emergencySupport", e.target.checked)}
            />
            <Label>Emergency Support</Label>
          </div>

          <div className="space-y-2">
            <Label>Registration Number</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("registrationNumber")}
            />
            {form.formState.errors.registrationNumber?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.registrationNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Council Name</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("councilName")}
            />
            {form.formState.errors.councilName?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.councilName.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Verification Doc URL</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("verificationDoc")}
            />
            {form.formState.errors.verificationDoc?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.verificationDoc.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Govt ID Doc URL</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("govtIdDoc")}
            />
            {form.formState.errors.govtIdDoc?.message && (
              <p className="text-xs text-rose-300">{form.formState.errors.govtIdDoc.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Bank Account</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("bankAccount")}
            />
            {form.formState.errors.bankAccount?.message && (
              <p className="text-xs text-rose-300">{form.formState.errors.bankAccount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>PAN Card</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              {...form.register("panCard")}
            />
            {form.formState.errors.panCard?.message && (
              <p className="text-xs text-rose-300">{form.formState.errors.panCard.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-xl bg-cyan-600 text-white hover:bg-cyan-700"
            >
              {isPending ? "Creating..." : "Create Doctor Profile"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
