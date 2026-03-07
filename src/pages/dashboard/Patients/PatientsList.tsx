import { useMemo } from "react";
import { Mail, MoreHorizontal, Phone, Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RecordsOverview,
  type RecordColumn,
} from "@/components/dashboard/RecordsOverview";
import { useDeletePatientProfile, usePatients } from "@/hooks/usePatient";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

type PatientStatus = "Active" | "In Treatment" | "Discharged";

interface PatientRecord {
  id: string;
  profileId: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  emergencyContact: string;
  bloodGroup: string;
  consultationType: string;
  paymentMode: string;
  status: PatientStatus;
}

const normalizeStatus = (value: unknown): PatientStatus => {
  if (value === "Discharged") return "Discharged";
  if (value === "In Treatment") return "In Treatment";
  return "Active";
};

const statusBadgeColor = (status: PatientStatus) => {
  switch (status) {
    case "Active":
      return "bg-green-400/10 text-green-300 border border-green-400/30";
    case "In Treatment":
      return "bg-amber-400/10 text-amber-300 border border-amber-400/30";
    case "Discharged":
      return "bg-blue-400/10 text-blue-300 border border-blue-400/30";
    default:
      return "bg-gray-400/10 text-gray-300 border border-gray-400/30";
  }
};

const getDefaultAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name || "Patient"
  )}`;

const extractPatients = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;
  const nestedData = data.data;
  const candidates: unknown[] = [
    nestedData,
    data.patients,
    data.profiles,
    data.result,
    typeof nestedData === "object" && nestedData
      ? (nestedData as Record<string, unknown>).data
      : undefined,
  ];

  const match = candidates.find((item) => Array.isArray(item));
  return (match as unknown[]) || [];
};

const mapPatient = (patient: unknown): PatientRecord => {
  const row = (patient ?? {}) as Record<string, unknown>;
  const user = (row.user ?? {}) as Record<string, unknown>;
  const name = String(row.name ?? row.patient_name ?? user.name ?? "Unnamed Patient");

  return {
    id: String(row.user_id ?? row.userId ?? user.id ?? row.id ?? name),
    profileId: String(
      row.patient_profile_id ?? row.profileId ?? row.profile_id ?? row.id ?? "-"
    ),
    name,
    image: String(row.profile_pic ?? user.profile_pic ?? getDefaultAvatar(name)),
    email: String(row.email ?? user.email ?? "--"),
    phone: String(row.phone ?? user.phone ?? "--"),
    emergencyContact: String(row.emergency_contact ?? "--"),
    bloodGroup: String(row.blood_group ?? "--"),
    consultationType: String(row.consultation_type ?? "--"),
    paymentMode: String(row.payment_mode ?? "--"),
    status: normalizeStatus(row.status),
  };
};

const renderPatientMobileCard = (patient: PatientRecord) => (
  <Card className="p-3 sm:p-4">
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <img
          src={patient.image}
          alt={patient.name}
          className="h-10 w-10 rounded-full flex-shrink-0"
          onError={(event) => {
            event.currentTarget.src = getDefaultAvatar(patient.name);
          }}
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{patient.name}</p>
          <p className="text-xs text-gray-400">Profile ID: {patient.profileId}</p>
        </div>
        <span
          className={`text-xs font-semibold ${statusBadgeColor(
            patient.status
          )} px-2 py-1 rounded-full`}
        >
          {patient.status}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-300">
        <Mail className="h-3.5 w-3.5" />
        {patient.email}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <Phone className="h-3.5 w-3.5" />
        {patient.phone}
      </div>
      <div className="text-xs text-gray-400">
        Emergency: <span className="text-white">{patient.emergencyContact}</span>
      </div>
      <div className="text-xs text-gray-400">
        Consultation: <span className="text-white">{patient.consultationType}</span>
      </div>
    </div>
  </Card>
);

export default function PatientsList() {
  const navigate = useNavigate();
  const { data, isLoading } = usePatients();
  const { mutate: deleteProfile, isPending: isDeleting } = useDeletePatientProfile();
  const { toast } = useToast();

  const patients: PatientRecord[] = useMemo(() => {
    const rows = extractPatients(data);
    return rows.map(mapPatient);
  }, [data]);

  const patientColumns: RecordColumn<PatientRecord>[] = [
    {
      id: "patient",
      header: "Patient",
      render: (patient) => (
        <div className="flex items-center gap-2">
          <img
            src={patient.image}
            alt={patient.name}
            className="h-8 w-8 rounded-full flex-shrink-0"
            onError={(event) => {
              event.currentTarget.src = getDefaultAvatar(patient.name);
            }}
          />
          <div className="flex flex-col">
            <span className="font-medium text-white">{patient.name}</span>
            <span className="text-xs text-gray-400">Profile ID: {patient.profileId}</span>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      className: "text-gray-300",
      render: (patient) => (
        <div className="flex flex-col gap-1 text-xs">
          <span>{patient.email}</span>
          <span>{patient.phone}</span>
        </div>
      ),
    },
    {
      id: "details",
      header: "Details",
      className: "text-gray-300",
      hideOn: "lg",
      render: (patient) => (
        <div className="flex flex-col gap-1 text-xs">
          <span>Emergency: {patient.emergencyContact}</span>
          <span>Blood Group: {patient.bloodGroup}</span>
        </div>
      ),
    },
    {
      id: "billing",
      header: "Billing",
      className: "text-gray-300",
      hideOn: "lg",
      render: (patient) => patient.paymentMode,
    },
    {
      id: "status",
      header: "Status",
      render: (patient) => (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeColor(
            patient.status
          )}`}
        >
          {patient.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      render: (patient) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs sm:text-sm">
            <DropdownMenuItem
              className="cursor-pointer text-xs"
              onClick={() =>
                navigate("/admin/patients/add-patient", {
                  state: { profileId: patient.profileId },
                })
              }
            >
              Update Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-xs text-red-400"
              onClick={() => {
                const id = Number(patient.profileId);
                if (!id) {
                  toast({
                    title: "Delete blocked",
                    description: "Invalid patient profile id.",
                    variant: "error",
                  });
                  return;
                }
                const ok = window.confirm(
                  `Delete patient profile ${patient.profileId}?`
                );
                if (!ok) {
                  return;
                }
                deleteProfile(id, {
                  onSuccess: () => {
                    toast({
                      title: "Patient deleted",
                      description: `${patient.name} profile deleted successfully.`,
                      variant: "success",
                    });
                  },
                  onError: (error) => {
                    toast({
                      title: "Delete failed",
                      description: getErrorMessage(error, "Could not delete patient profile."),
                      variant: "error",
                    });
                  },
                });
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Profile"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Patients</h1>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            Live patient profiles from admin API with search and pagination.
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          <Button variant="outline" className="cursor-pointer gap-2">
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>
          <Button
            onClick={() => navigate("/admin/patients/add-patient")}
            className="gap-1 sm:gap-2 flex justify-center items-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add patient</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <RecordsOverview
        title="Patient directory"
        description="Fetched from /admin/getpatientprofile with paginated view."
        items={patients}
        getRowId={(patient) => `${patient.profileId}-${patient.id}`}
        columns={patientColumns}
        mobileCard={renderPatientMobileCard}
        searchPlaceholder="Search patients..."
        searchFields={(patient) => [
          patient.name,
          patient.email,
          patient.phone,
          patient.emergencyContact,
          patient.consultationType,
          patient.paymentMode,
          patient.profileId,
        ]}
        emptyMessage={isLoading ? "Loading patients..." : "No patients found"}
        paginated
        pageSize={8}
      />
    </div>
  );
}
