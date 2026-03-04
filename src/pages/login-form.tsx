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
import { Eye, EyeClosedIcon } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

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
            setLoginError("Login response me token nahi mila. Backend token field check karo.");
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
          navigate("/", { replace: true });
        },
        onError: (err: any) => {
          setLoginError(
            err?.response?.data?.message || "Invalid email or password"
          );
        },
      }
    );
  };

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (auth?.isAuth && auth?.token) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div
      className={cn(
        "flex w-full md:mt-10 dark:bg-black items-center justify-center flex-col gap-6",
        className
      )}
      {...props}
    >
      <Card className="md:w-100 w-[96%] m-4">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>

              <FieldSeparator className="font-normal">
                Or continue with
              </FieldSeparator>

              <Field className="gap-2">
                <FieldLabel
                  htmlFor="email"
                  className={errors.email ? "text-red-500" : ""}
                >
                  Email*
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                    setLoginError("");
                  }}
                  className={
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
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
                    Password*
                  </FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({ ...p, password: "" }));
                      setLoginError("");
                    }}
                    className={`pr-10 ${
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeClosedIcon /> : <Eye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </Field>

              {loginError && (
                <p className="text-sm text-red-500 text-center">
                  {loginError}
                </p>
              )}

              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
