import {
  Plus,
  Stethoscope,
  Mail,
  Phone,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";
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
import { useDoctors } from "@/hooks/useDoctor";
import { useMemo, useState } from "react";
import DoctorProfile from "./DoctorProfile";
import { useNavigate } from "react-router-dom";
import { usePendingDoctorKyc } from "@/hooks/useDoctor";

type DoctorStatus = "Available" | "On Leave" | "In Surgery";

interface DoctorRecord {
  id: string;
  name: string;
  image: string;
  clinic: string;
  email: string;
  phone: string;
  available: string[];
  status: DoctorStatus;
  rating: string;
}

const statusPillColor = (status: DoctorStatus) => {
  switch (status) {
    case "Available":
      return "bg-green-400/10 text-green-300 border border-green-400/30";
    case "In Surgery":
      return "bg-amber-400/10 text-amber-300 border border-amber-400/30";
    case "On Leave":
      return "bg-blue-400/10 text-blue-300 border border-blue-400/30";
    default:
      return "bg-gray-400/10 text-gray-300 border border-gray-400/30";
  }
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeStatus = (value: unknown): DoctorStatus => {
  if (value === "Available" || value === "In Surgery" || value === "On Leave") {
    return value;
  }
  return "Available";
};

const getDefaultAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name || "Doctor"
  )}`;

const extractDoctors = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.data?.data,
    payload?.data,
    payload?.doctors,
    payload?.profiles,
    payload?.result,
  ];

  const match = candidates.find((item) => Array.isArray(item));
  return match ?? [];
};

const mapDoctor = (doc: any): DoctorRecord => ({
  id: String(
    doc?.doctor_profile_id ?? doc?.doctorId ?? doc?.id ?? doc?.user_id ?? Math.random()
  ),
  name: doc?.doctor_name ?? doc?.name ?? "Unnamed Doctor",
  image: doc?.profile_pic ?? doc?.user?.profile_pic ?? getDefaultAvatar(doc?.doctor_name ?? doc?.name ?? "Doctor"),
  clinic: doc?.clinic_name ?? doc?.clinicName ?? "--",
  email: doc?.email ?? doc?.user?.email ?? "--",
  phone: doc?.phone ?? doc?.user?.phone ?? "--",
  available: toArray(doc?.available_days ?? doc?.availableDays),
  status: normalizeStatus(doc?.status),
  rating: String(doc?.average_rating ?? doc?.rating ?? "0"),
});

const renderDoctorMobileCard = (doctor: DoctorRecord) => (
  <Card className="p-3 sm:p-4">
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-10 w-10 rounded-full flex-shrink-0"
          onError={(event) => {
            event.currentTarget.src = getDefaultAvatar(doctor.name);
          }}
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{doctor.name}</p>
        </div>
        <span
          className={`text-xs font-semibold ${statusPillColor(
            doctor.status
          )} px-2 py-1 rounded-full`}
        >
          {doctor.status}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <Mail className="h-3.5 w-3.5" />
        {doctor.email}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <Phone className="h-3.5 w-3.5" />
        {doctor.phone}
      </div>
      <div className="text-xs text-gray-400">
        Available:{" "}
        <span className="text-white">
          {doctor.available.length ? doctor.available.join(", ") : "No slots"}
        </span>
      </div>
    </div>
  </Card>
);

export default function DoctorsList() {
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRecord | null>(null);
  const { data, isLoading, error } = useDoctors();
  const { data: pendingKycData } = usePendingDoctorKyc();

  const doctors: DoctorRecord[] = useMemo(() => {
    const rows = extractDoctors(data);
    return rows.map(mapDoctor);
  }, [data]);

  const pendingKycCount = useMemo(() => {
    if (Array.isArray(pendingKycData)) return pendingKycData.length;
    const payload = pendingKycData as Record<string, unknown> | undefined;
    const nestedData = payload?.data;
    const candidates = [
      payload?.pendingDoctors,
      payload?.doctors,
      nestedData,
      typeof nestedData === "object" && nestedData
        ? (nestedData as Record<string, unknown>).data
        : undefined,
    ];
    const match = candidates.find((item) => Array.isArray(item));
    return Array.isArray(match) ? match.length : 0;
  }, [pendingKycData]);

  const doctorColumns: RecordColumn<DoctorRecord>[] = [
    {
      id: "doctor",
      header: "Doctor",
      render: (doctor) => (
        <div className="flex items-center gap-2">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="h-8 w-8 rounded-full flex-shrink-0"
            onError={(event) => {
              event.currentTarget.src = getDefaultAvatar(doctor.name);
            }}
          />
          <div className="flex flex-col">
            <span className="font-medium ">{doctor.name}</span>
          </div>
        </div>
      ),
    },
    {
      id: "clinic",
      header: "Clinic",
      className: "text-gray-300",
      hideOn: "lg",
      render: (doctor) => doctor.clinic,
    },
    {
      id: "contact",
      header: "Contact",
      className: "text-gray-300",
      render: (doctor) => (
        <div className="flex flex-col gap-1 text-xs">
          <span>{doctor.email}</span>
          <span>{doctor.phone}</span>
        </div>
      ),
    },
    {
      id: "availability",
      header: "Available Days",
      className: "text-gray-300",
      render: (doctor) =>
        doctor.available.length > 0 ? doctor.available.join(", ") : "No slots",
    },
    {
      id: "status",
      header: "Status",
      render: (doctor) => (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusPillColor(
            doctor.status
          )}`}
        >
          {doctor.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      render: (doctor) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs sm:text-sm">
            <DropdownMenuItem
              onClick={() => {
                setSelectedDoctor(doctor);
                setProfileModalOpen(true);
              }}
              className="cursor-pointer text-xs"
            >
              View Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  console.log("Doctors data:", data, "Loading:", isLoading, "Error:", error);

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Doctors</h1>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            Track availability and assign cases with confidence.
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/doctors/kyc-verification")}
            className="cursor-pointer gap-2"
          >
            <ShieldCheck className="h-4 w-4" />
            KYC ({pendingKycCount})
          </Button>
          <Button variant="outline" className=" cursor-pointer gap-2">
            <Stethoscope className="h-4 w-4" />
            Invite consultant
          </Button>
          <Button
            onClick={() => navigate("/admin/doctors/add-doctor")}
            className="gap-1 sm:gap-2 flex justify-center items-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add doctor</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <RecordsOverview
        title="Doctors directory"
        description="See specialties, contact details, and next availability."
        items={doctors}
        getRowId={(doctor) => doctor.id}
        columns={doctorColumns}
        mobileCard={renderDoctorMobileCard}
        searchPlaceholder="Search doctors..."
        searchFields={(doctor) => [
          doctor.name,
          doctor.clinic,
          doctor.phone,
          doctor.status,
          doctor.available.join(", "),
        ]}
        emptyMessage="No doctors found"
      />

      {profileModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => {
              setProfileModalOpen(false);
              setSelectedDoctor(null);
            }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">
                {selectedDoctor.name || "Doctor Profile"}
              </h2>

              <button
                onClick={() => setProfileModalOpen(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                x
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <DoctorProfile doctor={selectedDoctor} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
