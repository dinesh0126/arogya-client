import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Activity,
  Eye,
  EyeClosedIcon,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

const extractToken = (data: any): string => {
  return (
    data?.token ||
    data?.access_token ||
    data?.accessToken ||
    data?.jwt ||
    data?.data?.token ||
    data?.data?.access_token ||
    data?.data?.accessToken ||
    data?.data?.jwt ||
    data?.data?.data?.token ||
    data?.data?.data?.access_token ||
    data?.data?.data?.accessToken ||
    ""
  );
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const { toast } = useToast();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    mutate(
      { email, password },
      {
        onSuccess: (data: any) => {
          const resolvedToken = extractToken(data);

          if (!resolvedToken) {
            const text =
              "Login response me token nahi mila. Backend token field check karo.";
            setLoginError(text);
            toast({ title: "Login failed", description: text, variant: "error" });
            return;
          }

          localStorage.setItem(
            "auth",
            JSON.stringify({
              isAuth: true,
              role: "admin",
              token: resolvedToken,
              user: data?.user || data?.data?.user || null,
            })
          );
          toast({
            title: "Welcome to Arogya Healthcare",
            description: "Admin session started successfully.",
            variant: "success",
          });
          navigate("/", { replace: true });
        },
        onError: (err: any) => {
          const text = getErrorMessage(err, "Invalid email or password");
          setLoginError(text);
          toast({ title: "Login failed", description: text, variant: "error" });
        },
      }
    );
  };

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (auth?.isAuth && auth?.token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.16),_transparent_24%),linear-gradient(145deg,#020817_0%,#0f172a_40%,#10243a_100%)] px-4 py-8 text-white md:px-8 md:py-10",
        className
      )}
      {...props}
    >
      <div className="absolute left-6 top-10 h-36 w-36 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 text-white shadow-2xl lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 ring-1 ring-cyan-300/20">
              <HeartPulse className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
                Arogya Healthcare
              </p>
              <h1 className="text-3xl font-semibold">Doctor Platform Admin</h1>
            </div>
          </div>

          <div className="mt-12 max-w-xl space-y-5">
            <p className="text-5xl font-semibold leading-tight">
             Arogya Admin Command Center
            </p>
            <p className="text-base font-medium text-slate-300">
               Powerful tools to manage doctors, patients, appointments, and platform operations in one secure place.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Stethoscope className="mb-3 h-5 w-5 text-cyan-300" />
              <p className="text-sm font-semibold">Doctor onboarding</p>
              <p className="mt-1 text-xs font-medium text-slate-300">
                Create doctor accounts and drive KYC approvals faster.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Activity className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="text-sm font-semibold">Live operations</p>
              <p className="mt-1 text-xs font-medium text-slate-300">
                Track appointments, plans, and patient updates in one place.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-sky-300" />
              <p className="text-sm font-semibold">Secure access</p>
              <p className="mt-1 text-xs font-medium text-slate-300">
                Admin-only entry with protected healthcare data controls.
              </p>
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-3 pb-2">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                  Arogya Healthcare
                </p>
                <p className="text-sm font-semibold">Doctor Platform Admin</p>
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-300">
              Sign in to manage doctors, patients, appointments, and plan operations.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin}>
              <FieldGroup className="gap-5">
                <FieldSeparator className="font-normal text-slate-400">
                  Secure admin login
                </FieldSeparator>

                <Field className="gap-2">
                  <FieldLabel
                    htmlFor="email"
                    className={errors.email ? "text-red-500" : ""}
                  >
                    Admin Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@arogyahealthcare.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((p) => ({ ...p, email: "" }));
                      setLoginError("");
                    }}
                    className={cn(
                      "h-11 rounded-xl border-slate-800 bg-slate-900/70 text-white placeholder:text-slate-500",
                      errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </Field>

                <Field className="gap-2">
                  <div className="flex items-center">
                    <FieldLabel
                      htmlFor="password"
                      className={errors.password ? "text-red-500" : ""}
                    >
                      Password
                    </FieldLabel>
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm font-medium text-cyan-300 hover:underline"
                    >
                      Reset access
                    </Link>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Enter your secure password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((p) => ({ ...p, password: "" }));
                        setLoginError("");
                      }}
                      className={cn(
                        "h-11 rounded-xl border-slate-800 bg-slate-900/70 pr-10 text-white placeholder:text-slate-500",
                        errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? (
                        <EyeClosedIcon className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </Field>

                {loginError && (
                  <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                    {loginError}
                  </p>
                )}

                <Field>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 w-full rounded-xl bg-cyan-600 text-white hover:bg-cyan-700"
                  >
                    {isPending ? "Logging in..." : "Login to Dashboard"}
                  </Button>
                </Field>

                <FieldDescription className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-left text-sm leading-6 text-slate-300">
                  Your admin access controls the Arogya Healthcare doctor platform.
                  Keep credentials restricted to authorized operations staff only.
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
