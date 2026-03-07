import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { HeartPulse } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<"change password" | "otp">("change password");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  // handle text input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // send OTP
  const handleSendOtp = () => {
    if (!formData.phone && !formData.email) {
      toast({
        title: "OTP send failed",
        description: "Please enter your phone or email first.",
        variant: "error",
      });
      return;
    }

    // simulate OTP send
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    toast({
      title: "OTP sent",
      description: `Demo OTP: ${randomOtp}`,
      variant: "success",
    });
    setStep("otp");
  };

  // verify OTP
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      toast({
        title: "OTP verified",
        description: "Password reset flow completed successfully.",
        variant: "success",
      });
      navigate("/login");
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[linear-gradient(135deg,#e6f6ff_0%,#f7fcff_45%,#d9fff2_100%)] px-4">
      <Card className="w-full max-w-md border-white/80 bg-white/90 shadow-2xl backdrop-blur">
        <CardHeader>
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700">
              <HeartPulse className="h-6 w-6" />
            </div>
          </div>
          <p className="text-center text-xs uppercase tracking-[0.3em] text-cyan-700">
            Arogya Healthcare
          </p>
          <CardTitle className="text-center text-2xl font-semibold">
            {step === "change password" ? "Change Password" : "Verify OTP "}
          </CardTitle>
        </CardHeader>

        {step === "change password" ? (
          <CardContent className="flex flex-col gap-4">
            <Field className="gap-2">
              <FieldLabel>Email*</FieldLabel>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="font-normal"
              />
            </Field>
             <Field className="gap-2">
              <FieldLabel>Current Password*</FieldLabel>
              <Input
                name="password"
                type="password"
                placeholder="Current Password"
            
                className="font-normal"
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel>New Password*</FieldLabel>
              <Input
                name="password"
                type="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                className="font-normal"
              />
            </Field>
            <Button onClick={handleSendOtp} className="bg-cyan-600 hover:bg-cyan-700">
              Send OTP
            </Button>
{/* 
            <Button
              className="mt-2 cursor-pointer"
              variant="outline"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 mr-2"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Signup with Google
            </Button> */}

            <FieldDescription className="text-center">
              Back to Login{" "}
              <Link to="/auth/login" className="text-blue-600 underline">
                Login
              </Link>
            </FieldDescription>
          </CardContent>
        ) : (
          <CardContent className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              className="font-normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <p className="font-light text-[12px] ">An OTP has been sent to your email/phone.</p>
            <Button onClick={handleVerifyOtp} className="bg-cyan-600 hover:bg-cyan-700">
              Verify OTP
            </Button>
            <Button variant="outline" type="button" onClick={handleSendOtp}>
              Resend OTP
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Signup;
