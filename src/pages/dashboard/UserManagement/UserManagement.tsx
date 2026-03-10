import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useCreateUser } from "@/hooks/useAdmin";
import { getErrorMessage } from "@/lib/errors";
import type { CreateUserPayload } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createUserSchema = z.object({
  role: z.enum(["doctor", "patient"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  dob: z.string().min(1, "DOB is required"),
  gender: z.enum(["male", "female", "other"]),
  aadhar: z.string().min(6, "Aadhar is required"),
  profile_pic: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.startsWith("http"), {
      message: "Profile picture must be a valid URL",
    }),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

const getDefaultAvatar = (seed: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed || "User")}`;

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

export default function UserManagement() {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useCreateUser();

  const defaultValues = useMemo<CreateUserFormValues>(
    () => ({
      role: "doctor",
      name: "",
      email: "",
      phone: "",
      password: "",
      dob: "",
      gender: "male",
      aadhar: "",
      profile_pic: "",
    }),
    []
  );

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = async (values: CreateUserFormValues) => {
    form.clearErrors();
    try {
      const payload: CreateUserPayload = {
        ...values,
        profile_pic: values.profile_pic?.trim() || getDefaultAvatar(values.name),
        gender: values.gender,
      };

      const res = await mutateAsync(payload);
      toast({
        title: "User created",
        description: `${values.role} created successfully.`,
        variant: "success",
      });

      form.reset({ ...defaultValues, role: values.role });
      return res;
    } catch (err) {
      const fieldErrors = tryExtractFieldErrors(err);
      for (const [key, message] of Object.entries(fieldErrors)) {
        if (key in defaultValues) {
          form.setError(key as keyof CreateUserFormValues, {
            type: "server",
            message,
          });
        }
      }
      const text = getErrorMessage(err, "Create user failed");
      form.setError("root", { type: "server", message: text });
      toast({ title: "Create user failed", description: text, variant: "error" });
    }
  };

  const rootError = (form.formState.errors as any)?.root?.message as
    | string
    | undefined;

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
        <p className="text-sm text-slate-300">
          Create Doctor or Patient users via `POST /admin/createuser`.
        </p>
      </div>

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
            <Label>Role</Label>
            <select
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 text-slate-100"
              {...form.register("role")}
            >
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
            {form.formState.errors.role?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              placeholder="Full name"
              {...form.register("name")}
            />
            {form.formState.errors.name?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              placeholder="name@email.com"
              {...form.register("email")}
            />
            {form.formState.errors.email?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              placeholder="Phone number"
              {...form.register("phone")}
            />
            {form.formState.errors.phone?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              placeholder="Min 6 characters"
              {...form.register("password")}
            />
            {form.formState.errors.password?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100"
              {...form.register("dob")}
            />
            {form.formState.errors.dob?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.dob.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <select
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 text-slate-100"
              {...form.register("gender")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {form.formState.errors.gender?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.gender.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Aadhar</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              placeholder="Aadhar number"
              {...form.register("aadhar")}
            />
            {form.formState.errors.aadhar?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.aadhar.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Profile Pic URL (optional)</Label>
            <Input
              className="h-11 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400"
              placeholder="https://..."
              {...form.register("profile_pic")}
            />
            {form.formState.errors.profile_pic?.message && (
              <p className="text-xs text-rose-300">
                {form.formState.errors.profile_pic.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-xl bg-cyan-600 text-white hover:bg-cyan-700"
            >
              {isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

