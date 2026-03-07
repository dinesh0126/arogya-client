import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreatePatientProfile,
  useCreatePatientUser,
  useUpdatePatientProfile,
} from "@/hooks/usePatient";
import type {
  CreatePatientProfilePayload,
  UpdatePatientProfilePayload,
} from "@/types/patient";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

const getDefaultAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name || "Patient"
  )}`;

const extractUserId = (responseData: unknown): number => {
  const data = responseData as Record<string, unknown> | undefined;
  const nestedData = data?.data as Record<string, unknown> | undefined;
  const user = data?.user as Record<string, unknown> | undefined;
  const newUser = data?.newUser as Record<string, unknown> | undefined;
  const createdUser = data?.createdUser as Record<string, unknown> | undefined;
  const createduser = data?.createduser as Record<string, unknown> | undefined;
  const result = data?.result as Record<string, unknown> | undefined;
  const nestedUser = nestedData?.user as Record<string, unknown> | undefined;
  const nestedNewUser = nestedData?.newUser as Record<string, unknown> | undefined;
  const nestedCreatedUser = nestedData?.createdUser as
    | Record<string, unknown>
    | undefined;

  return Number(
    user?.id ??
      newUser?.id ??
      createdUser?.id ??
      createduser?.id ??
      result?.userId ??
      result?.id ??
      data?.userId ??
      data?.user_id ??
      nestedUser?.id ??
      nestedNewUser?.id ??
      nestedCreatedUser?.id ??
      nestedData?.userId ??
      nestedData?.user_id ??
      nestedData?.id ??
      0
  );
};

const extractProfileId = (responseData: unknown): number => {
  const data = responseData as Record<string, unknown> | undefined;
  const nestedData = data?.data as Record<string, unknown> | undefined;
  const profile = data?.profile as Record<string, unknown> | undefined;
  const patientProfile = data?.patientProfile as Record<string, unknown> | undefined;

  return Number(
    profile?.id ??
      patientProfile?.id ??
      data?.id ??
      data?.profileId ??
      nestedData?.id ??
      nestedData?.profileId ??
      0
  );
};

const toNumber = (value: string) => Number(value || 0);

export default function AddPatient() {
  const location = useLocation();
  const profileUserIdRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const { mutate: createUser, isPending: isCreatingUser } = useCreatePatientUser();
  const { mutate: createProfile, isPending: isCreatingProfile } =
    useCreatePatientProfile();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdatePatientProfile();

  const [userId, setUserId] = useState<number | null>(null);
  const stateProfileId = Number(
    (location.state as { profileId?: string } | null)?.profileId || 0
  );
  const [profileId, setProfileId] = useState<number | null>(
    stateProfileId || null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId || !profileUserIdRef.current) {
      return;
    }
    profileUserIdRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    profileUserIdRef.current.focus();
  }, [userId]);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    gender: "male",
    profile_pic: "",
    aadhar: "",
    role: "patient" as const,
  });

  const [profileForm, setProfileForm] = useState({
    emergency_contact: "",
    preferred_language: "English",
    consultation_type: "teleconsultation",
    blood_group: "",
    allergies: "",
    existing_conditions: "",
    medications: "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
    lifestyle_smoking: false,
    lifestyle_alcohol: false,
    insurence_provider: "",
    policy_number: "",
    payment_mode: "",
  });

  const handleUserChange = (field: keyof typeof userForm, value: string) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (
    field: keyof typeof profileForm,
    value: string | boolean
  ) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildCreateProfilePayload = (): Omit<
    CreatePatientProfilePayload,
    "userId"
  > => ({
    emergency_contact: profileForm.emergency_contact,
    preferred_language: profileForm.preferred_language,
    consultation_type: profileForm.consultation_type,
    blood_group: profileForm.blood_group,
    allergies: profileForm.allergies,
    existing_conditions: profileForm.existing_conditions,
    medications: profileForm.medications,
    age: toNumber(profileForm.age),
    height: toNumber(profileForm.height),
    weight: toNumber(profileForm.weight),
    bmi: toNumber(profileForm.bmi),
    lifestyle_smoking: profileForm.lifestyle_smoking,
    lifestyle_alcohol: profileForm.lifestyle_alcohol,
    insurence_provider: profileForm.insurence_provider,
    policy_number: profileForm.policy_number,
    payment_mode: profileForm.payment_mode,
  });

  const buildUpdateProfilePayload = (): UpdatePatientProfilePayload => ({
    ...buildCreateProfilePayload(),
    userId: userId ?? undefined,
  });

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
            const text = "Patient created but userId not found in response.";
            setMessage(text);
            toast({ title: "Patient create issue", description: text, variant: "error" });
            return;
          }

          setUserId(createdUserId);
          const text = `Patient created successfully. userId: ${createdUserId}`;
          setMessage(text);
          toast({ title: "Patient created", description: text, variant: "success" });
        },
        onError: (error: unknown) => {
          const text = getErrorMessage(error, "Patient create failed");
          setMessage(text);
          toast({ title: "Patient create failed", description: text, variant: "error" });
        },
      }
    );
  };

  const handleCreateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      const text = "First create patient, then create profile.";
      setMessage(text);
      toast({ title: "Patient profile blocked", description: text, variant: "error" });
      return;
    }

    setMessage("");

    createProfile(
      {
        userId,
        ...buildCreateProfilePayload(),
      },
      {
        onSuccess: (data) => {
          const createdProfileId = extractProfileId(data);
          if (createdProfileId) {
            setProfileId(createdProfileId);
          }
          const text = `Patient profile created successfully for userId: ${userId}${
            createdProfileId ? ` (profileId: ${createdProfileId})` : ""
          }`;
          setMessage(text);
          toast({ title: "Patient profile created", description: text, variant: "success" });
        },
        onError: (error: unknown) => {
          const text = getErrorMessage(error, "Profile create failed");
          setMessage(text);
          toast({ title: "Patient profile failed", description: text, variant: "error" });
        },
      }
    );
  };

  const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profileId) {
      const text = "Profile ID is required to update patient profile.";
      setMessage(text);
      toast({ title: "Patient update blocked", description: text, variant: "error" });
      return;
    }

    setMessage("");

    updateProfile(
      {
        profileId,
        payload: buildUpdateProfilePayload(),
      },
      {
        onSuccess: () => {
          const text = `Patient profile updated successfully. profileId: ${profileId}`;
          setMessage(text);
          toast({ title: "Patient profile updated", description: text, variant: "success" });
        },
        onError: (error: unknown) => {
          const text = getErrorMessage(error, "Profile update failed");
          setMessage(text);
          toast({ title: "Patient update failed", description: text, variant: "error" });
        },
      }
    );
  };

  return (
    <div className="w-full space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div>
        <h1 className="text-3xl font-bold">Add Patient</h1>
        <p className="text-sm text-gray-400">
          Step 1 me patient create hoga with hardcoded role patient, then same userId se profile create hogi.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Step 1: Create Patient</h2>
        <form onSubmit={handleCreateUser} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={userForm.name}
              onChange={(event) => handleUserChange("name", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={userForm.email}
              onChange={(event) => handleUserChange("email", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={userForm.phone}
              onChange={(event) => handleUserChange("phone", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={userForm.password}
              onChange={(event) => handleUserChange("password", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>DOB</Label>
            <Input
              type="date"
              value={userForm.dob}
              onChange={(event) => handleUserChange("dob", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <select
              value={userForm.gender}
              onChange={(event) => handleUserChange("gender", event.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-transparent"
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
              onChange={(event) =>
                handleUserChange("profile_pic", event.target.value)
              }
              placeholder="Optional. Leave empty for random avatar."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Aadhar</Label>
            <Input
              value={userForm.aadhar}
              onChange={(event) => handleUserChange("aadhar", event.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button
              type="submit"
              disabled={isCreatingUser}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreatingUser ? "Creating patient..." : "Create Patient"}
            </Button>
            <span className="text-sm text-gray-400">
              userId: {userId ?? "Not created yet"}
            </span>
          </div>
        </form>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Step 2: Create Patient Profile</h2>
        <p className="text-sm text-gray-400">Uses `POST /admin/createuserprofle`.</p>
        <form onSubmit={handleCreateProfile} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>User ID</Label>
            <Input
              ref={profileUserIdRef}
              value={userId ?? ""}
              readOnly
              placeholder="Created in step 1"
            />
          </div>
          <div className="space-y-2">
            <Label>Emergency Contact</Label>
            <Input
              value={profileForm.emergency_contact}
              onChange={(event) =>
                handleProfileChange("emergency_contact", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Preferred Language</Label>
            <Input
              value={profileForm.preferred_language}
              onChange={(event) =>
                handleProfileChange("preferred_language", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Consultation Type</Label>
            <Input
              value={profileForm.consultation_type}
              onChange={(event) =>
                handleProfileChange("consultation_type", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Blood Group</Label>
            <Input
              value={profileForm.blood_group}
              onChange={(event) => handleProfileChange("blood_group", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Allergies</Label>
            <Input
              value={profileForm.allergies}
              onChange={(event) => handleProfileChange("allergies", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Existing Conditions</Label>
            <Input
              value={profileForm.existing_conditions}
              onChange={(event) =>
                handleProfileChange("existing_conditions", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Medications</Label>
            <Input
              value={profileForm.medications}
              onChange={(event) => handleProfileChange("medications", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Age</Label>
            <Input
              type="number"
              value={profileForm.age}
              onChange={(event) => handleProfileChange("age", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Height (cm)</Label>
            <Input
              type="number"
              step="0.1"
              value={profileForm.height}
              onChange={(event) => handleProfileChange("height", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              step="0.1"
              value={profileForm.weight}
              onChange={(event) => handleProfileChange("weight", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>BMI</Label>
            <Input
              type="number"
              step="0.1"
              value={profileForm.bmi}
              onChange={(event) => handleProfileChange("bmi", event.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={profileForm.lifestyle_smoking}
              onChange={(event) =>
                handleProfileChange("lifestyle_smoking", event.target.checked)
              }
            />
            <Label>Smoking</Label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={profileForm.lifestyle_alcohol}
              onChange={(event) =>
                handleProfileChange("lifestyle_alcohol", event.target.checked)
              }
            />
            <Label>Alcohol</Label>
          </div>
          <div className="space-y-2">
            <Label>Insurence Provider</Label>
            <Input
              value={profileForm.insurence_provider}
              onChange={(event) =>
                handleProfileChange("insurence_provider", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Policy Number</Label>
            <Input
              value={profileForm.policy_number}
              onChange={(event) =>
                handleProfileChange("policy_number", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Payment Mode</Label>
            <Input
              value={profileForm.payment_mode}
              onChange={(event) =>
                handleProfileChange("payment_mode", event.target.value)
              }
              required
            />
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isCreatingProfile || !userId}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreatingProfile ? "Creating profile..." : "Create Patient Profile"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Step 3: Update Patient Profile</h2>
        <form onSubmit={handleUpdateProfile} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Profile ID</Label>
            <Input
              type="number"
              value={profileId ?? ""}
              onChange={(event) => setProfileId(Number(event.target.value))}
              placeholder="Example: 2"
              required
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-400">
              Uses `PATCH /admin/updatepatientprofile/{profileId}`. Fields are
              optional for update.
            </p>
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isUpdatingProfile}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isUpdatingProfile ? "Updating profile..." : "Update Patient Profile"}
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
