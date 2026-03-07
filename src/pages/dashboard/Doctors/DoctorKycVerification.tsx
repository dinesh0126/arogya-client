import { useMemo } from "react";
import { ShieldCheck, UserCheck, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RecordsOverview,
  type RecordColumn,
} from "@/components/dashboard/RecordsOverview";
import {
  useApproveDoctorKyc,
  usePendingDoctorKyc,
  useRejectDoctorKyc,
} from "@/hooks/useDoctor";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

interface KycDoctorRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  verificationDoc: string;
  govtIdDoc: string;
  status: string;
}

const extractPendingDoctors = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;
  const nestedData = data.data;
  const candidates: unknown[] = [
    data.pendingDoctors,
    data.doctors,
    nestedData,
    typeof nestedData === "object" && nestedData
      ? (nestedData as Record<string, unknown>).data
      : undefined,
    data.result,
  ];

  const found = candidates.find((item) => Array.isArray(item));
  return (found as unknown[]) || [];
};

const mapKycDoctor = (doctor: unknown): KycDoctorRecord => {
  const row = (doctor ?? {}) as Record<string, unknown>;
  const user = (row.user ?? {}) as Record<string, unknown>;
  const doctorId = Number(
    row.doctor_profile_id ?? row.doctorId ?? row.id ?? row.user_id ?? user.id ?? 0
  );

  return {
    id: doctorId,
    name: String(row.doctor_name ?? row.name ?? user.name ?? "Unnamed Doctor"),
    email: String(row.email ?? user.email ?? "--"),
    phone: String(row.phone ?? user.phone ?? "--"),
    registrationNumber: String(
      row.registration_number ?? row.registrationNumber ?? "--"
    ),
    verificationDoc: String(row.verification_doc ?? row.verificationDoc ?? "--"),
    govtIdDoc: String(row.govt_id_doc ?? row.govtIdDoc ?? "--"),
    status: String(row.status ?? "Pending"),
  };
};

const normalizeDocLink = (value: string) => {
  if (!value || value === "--") return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return "";
};

const renderDocLink = (value: string) => {
  const href = normalizeDocLink(value);
  if (!href) return <span className="text-xs text-gray-400">Not Available</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-xs text-blue-400 hover:text-blue-300 underline"
    >
      Open Document
    </a>
  );
};

export default function DoctorKycVerification() {
  const { data, isLoading } = usePendingDoctorKyc();
  const { mutate: approveDoctor, isPending: approving } = useApproveDoctorKyc();
  const { mutate: rejectDoctor, isPending: rejecting } = useRejectDoctorKyc();
  const { toast } = useToast();

  const doctors = useMemo(() => {
    const rows = extractPendingDoctors(data);
    return rows.map(mapKycDoctor);
  }, [data]);

  const columns: RecordColumn<KycDoctorRecord>[] = [
    {
      id: "doctor",
      header: "Doctor",
      render: (doctor) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{doctor.name}</span>
          <span className="text-xs text-gray-400">ID: {doctor.id}</span>
        </div>
      ),
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
      id: "registration",
      header: "Reg. Number",
      className: "text-gray-300",
      hideOn: "lg",
      render: (doctor) => doctor.registrationNumber,
    },
    {
      id: "docs",
      header: "Documents",
      render: (doctor) => (
        <div className="flex flex-col gap-1">
          {renderDocLink(doctor.verificationDoc)}
          {renderDocLink(doctor.govtIdDoc)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      render: (doctor) => (
        <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              disabled={approving || rejecting}
              onClick={() =>
                approveDoctor(doctor.id, {
                  onSuccess: () => {
                    toast({
                      title: "Doctor approved",
                      description: `${doctor.name} KYC approved successfully.`,
                      variant: "success",
                    });
                  },
                  onError: (error) => {
                    toast({
                      title: "Approve failed",
                      description: getErrorMessage(error, "Could not approve doctor."),
                      variant: "error",
                    });
                  },
                })
              }
            >
            <UserCheck className="h-4 w-4 mr-1" />
            Accept
          </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={approving || rejecting}
              onClick={() =>
                rejectDoctor(doctor.id, {
                  onSuccess: () => {
                    toast({
                      title: "Doctor rejected",
                      description: `${doctor.name} KYC has been rejected.`,
                      variant: "info",
                    });
                  },
                  onError: (error) => {
                    toast({
                      title: "Reject failed",
                      description: getErrorMessage(error, "Could not reject doctor."),
                      variant: "error",
                    });
                  },
                })
              }
            >
            <UserX className="h-4 w-4 mr-1" />
            Deactivate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Doctor KYC Verification</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Review pending KYC and approve or deactivate doctor accounts.
          </p>
        </div>
        <Card className="px-4 py-2 flex items-center gap-2 w-fit">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span className="text-sm">Pending: {doctors.length}</span>
        </Card>
      </div>

      <RecordsOverview
        title="Pending KYC Requests"
        description="Endpoint: /admin/doctor/pending"
        items={doctors}
        getRowId={(doctor) => String(doctor.id)}
        columns={columns}
        mobileCard={(doctor) => (
          <Card className="p-4 space-y-2">
            <p className="font-medium text-white">{doctor.name}</p>
            <p className="text-xs text-gray-400">ID: {doctor.id}</p>
            <p className="text-xs text-gray-300">{doctor.email}</p>
            <p className="text-xs text-gray-300">{doctor.phone}</p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                disabled={approving || rejecting}
                onClick={() =>
                  approveDoctor(doctor.id, {
                    onSuccess: () => {
                      toast({
                        title: "Doctor approved",
                        description: `${doctor.name} KYC approved successfully.`,
                        variant: "success",
                      });
                    },
                    onError: (error) => {
                      toast({
                        title: "Approve failed",
                        description: getErrorMessage(error, "Could not approve doctor."),
                        variant: "error",
                      });
                    },
                  })
                }
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={approving || rejecting}
                onClick={() =>
                  rejectDoctor(doctor.id, {
                    onSuccess: () => {
                      toast({
                        title: "Doctor rejected",
                        description: `${doctor.name} KYC has been rejected.`,
                        variant: "info",
                      });
                    },
                    onError: (error) => {
                      toast({
                        title: "Reject failed",
                        description: getErrorMessage(error, "Could not reject doctor."),
                        variant: "error",
                      });
                    },
                  })
                }
              >
                Deactivate
              </Button>
            </div>
          </Card>
        )}
        searchPlaceholder="Search pending doctors..."
        searchFields={(doctor) => [
          doctor.name,
          doctor.email,
          doctor.phone,
          doctor.registrationNumber,
          doctor.status,
        ]}
        emptyMessage={isLoading ? "Loading pending KYC..." : "No pending KYC found"}
        paginated
        pageSize={8}
      />
    </div>
  );
}
