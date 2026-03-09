import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDoctorProfile, useCreateDoctorUser } from "@/hooks/useDoctor";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

const parseCommaList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getDefaultAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name || "Doctor"
  )}`;

const getInitialUserForm = () => ({
  name: "",
  email: "",
  phone: "",
  password: "",
  dob: "",
  gender: "male",
  profile_pic: "",
  aadhar: "",
  role: "doctor" as const,
});

const getInitialProfileForm = () => ({
  qualification: "",
  experienceYears: "",
  languagesSpoken: "",
  consultationTypes: "tele, manual",
  consultationFee: "",
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
});

const extractUserId = (data: any): number =>
  Number(
    data?.user?.id ||
      data?.createdUser?.id ||
      data?.userId ||
      data?.data?.user?.id ||
      data?.data?.createdUser?.id ||
      data?.data?.userId ||
      data?.data?.id ||
      0
  );

export default function AddDoctor() {
  const { mutate: createUser, isPending: isCreatingUser } = useCreateDoctorUser();
  const { mutate: createProfile, isPending: isCreatingProfile } = useCreateDoctorProfile();
  const { toast } = useToast();

  const [userId, setUserId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [userForm, setUserForm] = useState(getInitialUserForm);

  const [profileForm, setProfileForm] = useState(getInitialProfileForm);

  const handleUserChange = (field: keyof typeof userForm, value: string) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (
    field: keyof typeof profileForm,
    value: string | boolean
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    createUser(
      {
        ...userForm,
        profile_pic: userForm.profile_pic || getDefaultAvatar(userForm.name),
      },
      {
        onSuccess: (data) => {
          const createdUserId = extractUserId(data);
          if (!createdUserId) {
            const text = "Doctor created but userId response me nahi mila.";
            setMessage(text);
            toast({ title: "Doctor create issue", description: text, variant: "error" });
            return;
          }
          setUserId(createdUserId);
          setUserForm(getInitialUserForm());
          const text = `Doctor created successfully. userId: ${createdUserId}`;
          setMessage(text);
          toast({ title: "Doctor created", description: text, variant: "success" });
        },
        onError: (error: any) => {
          const text = getErrorMessage(error, "Doctor create failed");
          setMessage(text);
          toast({ title: "Doctor create failed", description: text, variant: "error" });
        },
      }
    );
  };

  const handleCreateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      const text = "Pehle doctor create karo, then profile create hogi.";
      setMessage(text);
      toast({ title: "Doctor profile blocked", description: text, variant: "error" });
      return;
    }

    setMessage("");

    createProfile(
      {
        userId,
        specialization: "General",
        qualification: profileForm.qualification,
        experienceYears: Number(profileForm.experienceYears),
        languagesSpoken: profileForm.languagesSpoken,
        consultationTypes: parseCommaList(profileForm.consultationTypes),
        consultationFee: Number(profileForm.consultationFee),
        workStartTime: profileForm.workStartTime,
        workEndTime: profileForm.workEndTime,
        availableDays: parseCommaList(profileForm.availableDays),
        timezone: profileForm.timezone,
        clinicName: profileForm.clinicName,
        clinicAddress: profileForm.clinicAddress,
        teleconsultationAvailable: profileForm.teleconsultationAvailable,
        emergencySupport: profileForm.emergencySupport,
        registrationNumber: profileForm.registrationNumber,
        councilName: profileForm.councilName,
        verificationDoc: profileForm.verificationDoc,
        govtIdDoc: profileForm.govtIdDoc,
        bankAccount: profileForm.bankAccount,
        panCard: profileForm.panCard,
      },
      {
        onSuccess: () => {
          setProfileForm(getInitialProfileForm());
          const text = `Doctor profile created successfully for userId: ${userId}`;
          setMessage(text);
          toast({ title: "Doctor profile created", description: text, variant: "success" });
        },
        onError: (error: any) => {
          const text = getErrorMessage(error, "Doctor profile create failed");
          setMessage(text);
          toast({ title: "Doctor profile failed", description: text, variant: "error" });
        },
      }
    );
  };

  return (
    <div className="w-full space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div>
        <h1 className="text-3xl font-bold">Add Doctor</h1>
        <p className="text-sm text-gray-400">
          Step 1 me doctor create hoga with hardcoded role doctor, then same userId se profile create hogi.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Step 1: Create Doctor</h2>
        <form onSubmit={handleCreateUser} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={userForm.name} onChange={(e) => handleUserChange("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={userForm.email} onChange={(e) => handleUserChange("email", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={userForm.phone} onChange={(e) => handleUserChange("phone", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={userForm.password} onChange={(e) => handleUserChange("password", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>DOB</Label>
            <Input type="date" value={userForm.dob} onChange={(e) => handleUserChange("dob", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <select
              value={userForm.gender}
              onChange={(e) => handleUserChange("gender", e.target.value)}
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-foreground"
              required
            >
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={userForm.role} readOnly />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Profile Pic URL</Label>
            <Input
              value={userForm.profile_pic}
              onChange={(e) => handleUserChange("profile_pic", e.target.value)}
              placeholder="Optional. Leave empty for random avatar."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Aadhar</Label>
            <Input value={userForm.aadhar} onChange={(e) => handleUserChange("aadhar", e.target.value)} required />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={isCreatingUser} className="bg-blue-600 hover:bg-blue-700">
              {isCreatingUser ? "Creating doctor..." : "Create Doctor"}
            </Button>
            <span className="text-sm text-gray-400">
              userId: {userId ?? "Not created yet"}
            </span>
          </div>
        </form>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Step 2: Create Doctor Profile</h2>
        <form onSubmit={handleCreateProfile} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>User ID</Label>
            <Input value={userId ?? ""} readOnly placeholder="Created in step 1" />
          </div>
          <div className="space-y-2">
            <Label>Qualification</Label>
            <Input value={profileForm.qualification} onChange={(e) => handleProfileChange("qualification", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Experience Years</Label>
            <Input type="number" value={profileForm.experienceYears} onChange={(e) => handleProfileChange("experienceYears", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Consultation Fee</Label>
            <Input type="number" value={profileForm.consultationFee} onChange={(e) => handleProfileChange("consultationFee", e.target.value)} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Languages Spoken</Label>
            <Input value={profileForm.languagesSpoken} onChange={(e) => handleProfileChange("languagesSpoken", e.target.value)} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Consultation Types (comma separated)</Label>
            <Input value={profileForm.consultationTypes} onChange={(e) => handleProfileChange("consultationTypes", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Work Start Time</Label>
            <Input type="time" value={profileForm.workStartTime} onChange={(e) => handleProfileChange("workStartTime", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Work End Time</Label>
            <Input type="time" value={profileForm.workEndTime} onChange={(e) => handleProfileChange("workEndTime", e.target.value)} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Available Days (comma separated)</Label>
            <Input value={profileForm.availableDays} onChange={(e) => handleProfileChange("availableDays", e.target.value)} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Timezone</Label>
            <Input value={profileForm.timezone} onChange={(e) => handleProfileChange("timezone", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Clinic Name</Label>
            <Input value={profileForm.clinicName} onChange={(e) => handleProfileChange("clinicName", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Clinic Address</Label>
            <Input value={profileForm.clinicAddress} onChange={(e) => handleProfileChange("clinicAddress", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Registration Number</Label>
            <Input value={profileForm.registrationNumber} onChange={(e) => handleProfileChange("registrationNumber", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Council Name</Label>
            <Input value={profileForm.councilName} onChange={(e) => handleProfileChange("councilName", e.target.value)} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Verification Doc URL</Label>
            <Input value={profileForm.verificationDoc} onChange={(e) => handleProfileChange("verificationDoc", e.target.value)} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Govt ID Doc URL</Label>
            <Input value={profileForm.govtIdDoc} onChange={(e) => handleProfileChange("govtIdDoc", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Bank Account</Label>
            <Input value={profileForm.bankAccount} onChange={(e) => handleProfileChange("bankAccount", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>PAN Card</Label>
            <Input value={profileForm.panCard} onChange={(e) => handleProfileChange("panCard", e.target.value)} required />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={profileForm.teleconsultationAvailable}
              onChange={(e) => handleProfileChange("teleconsultationAvailable", e.target.checked)}
            />
            <Label>Teleconsultation Available</Label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={profileForm.emergencySupport}
              onChange={(e) => handleProfileChange("emergencySupport", e.target.checked)}
            />
            <Label>Emergency Support</Label>
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isCreatingProfile || !userId}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreatingProfile ? "Creating profile..." : "Create Doctor Profile"}
            </Button>
          </div>
        </form>
      </Card>

      {message && (
        <Card className="p-4 text-sm">
          <p>{message}</p>
        </Card>
      )}
    </div>
  );
}
