import { useMemo, useState } from "react";
import { Calendar, ExternalLink, Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RecordsOverview, type RecordColumn } from "@/components/dashboard/RecordsOverview";
import { useAppointments } from "@/hooks/useAppointment";
import type { AppointmentRecord } from "@/types/appointment";

type AppointmentStatusFilter = "all" | "confirmed" | "cancelled" | "completed";

const STATUS_OPTIONS: AppointmentStatusFilter[] = [
  "all",
  "confirmed",
  "cancelled",
  "completed",
];

const formatUtcDate = (isoDate: string) => {
  if (!isoDate) {
    return "--";
  }
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("confirm")) {
    return "text-blue-400 bg-blue-400/10 border border-blue-400/30";
  }
  if (normalized.includes("progress")) {
    return "text-amber-400 bg-amber-400/10 border border-amber-400/30";
  }
  if (normalized.includes("complete")) {
    return "text-green-400 bg-green-400/10 border border-green-400/30";
  }
  if (normalized.includes("cancel")) {
    return "text-red-400 bg-red-400/10 border border-red-400/30";
  }
  return "text-gray-300 bg-gray-500/10 border border-gray-400/30";
};

const renderAppointmentMobileCard = (appointment: AppointmentRecord) => (
  <Card className="p-3 sm:p-4">
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            Appointment #{appointment.appointment_id ?? appointment.id}
          </p>
          <p className="text-xs text-gray-400">
            Doctor ID: {appointment.doctor_id ?? "--"} | Patient ID:{" "}
            {appointment.patient_id ?? "--"}
          </p>
        </div>
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            appointment.status
          )}`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        <p>Type: {appointment.type}</p>
        <p>Duration: {appointment.duration} min</p>
        <p>Start (UTC): {formatUtcDate(appointment.start_utc)}</p>
        <p>User Slot: {appointment.start_user || "--"} - {appointment.end_user || "--"}</p>
        <p>Timezone: {appointment.user_timezone || "--"}</p>
      </div>

      {appointment.meeting_link && (
        <a
          href={appointment.meeting_link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
        >
          Open Meeting Link
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  </Card>
);

export default function AllAppointments() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatusFilter>("all");

  const apiStatus = statusFilter === "all" ? undefined : statusFilter;
  const { data, isLoading, isFetching, error } = useAppointments({
    page,
    limit,
    status: apiStatus,
  });

  const appointments = data?.items ?? [];
  const pagination = data?.pagination ?? {
    page,
    limit,
    totalItems: appointments.length,
    totalPages: 1,
  };

  const appointmentColumns: RecordColumn<AppointmentRecord>[] = useMemo(
    () => [
      {
        id: "appointment",
        header: "Appointment",
        render: (appointment) => (
          <div className="flex flex-col">
            <span className="font-medium text-white">
              #{appointment.appointment_id ?? appointment.id}
            </span>
            <span className="text-xs text-gray-400">
              Created: {formatUtcDate(appointment.created_at)}
            </span>
          </div>
        ),
      },
      {
        id: "ids",
        header: "Doctor / Patient",
        className: "text-gray-300",
        render: (appointment) => (
          <div className="flex flex-col text-xs">
            <span>Doctor ID: {appointment.doctor_id ?? "--"}</span>
            <span>Patient ID: {appointment.patient_id ?? "--"}</span>
          </div>
        ),
      },
      {
        id: "slot",
        header: "Slot",
        render: (appointment) => (
          <div className="flex flex-col text-xs">
            <span className="text-white">{formatUtcDate(appointment.start_utc)}</span>
            <span className="text-gray-400">
              User: {appointment.start_user || "--"} - {appointment.end_user || "--"}
            </span>
            <span className="text-gray-400">
              Doctor: {appointment.start_doctor || "--"} - {appointment.end_doctor || "--"}
            </span>
          </div>
        ),
      },
      {
        id: "type",
        header: "Type",
        className: "text-gray-300",
        render: (appointment) => (
          <div className="flex flex-col text-xs">
            <span>{appointment.type}</span>
            <span>{appointment.duration} min</span>
          </div>
        ),
      },
      {
        id: "timezone",
        header: "Timezone",
        className: "text-gray-300",
        hideOn: "lg",
        render: (appointment) => (
          <div className="flex flex-col text-xs">
            <span>User: {appointment.user_timezone || "--"}</span>
            <span>Doctor: {appointment.doctor_timezone || "--"}</span>
          </div>
        ),
      },
      {
        id: "meeting",
        header: "Meeting",
        hideOn: "lg",
        render: (appointment) =>
          appointment.meeting_link ? (
            <a
              href={appointment.meeting_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
            >
              Open
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-xs text-gray-400">--</span>
          ),
      },
      {
        id: "status",
        header: "Status",
        render: (appointment) => (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">All Appointments</h1>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            Source: `/appointment?page={"{page}"}&limit={"{limit}"}&status={"{status}"}`
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          <Button variant="outline" className="cursor-pointer">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </Button>
          <Button
            onClick={() => navigate("/admin/appointments/add")}
            className="gap-2 cursor-pointer bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3"
          >
            <Plus className="h-4 w-4" />
            Add Appointment
          </Button>
        </div>
      </div>

      <Card className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Filter className="h-4 w-4" />
          Status Filter
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {STATUS_OPTIONS.map((option) => {
            const isActive = statusFilter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setStatusFilter(option);
                  setPage(1);
                }}
                className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                  isActive
                    ? "border-blue-400 bg-blue-500/20 text-blue-200"
                    : "border-gray-600 text-gray-300 hover:border-gray-400"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </Card>

      <RecordsOverview
        title="Appointments"
        description={`Filtered by status: ${apiStatus ?? "all"}`}
        items={appointments}
        getRowId={(appointment) => appointment.id}
        columns={appointmentColumns}
        mobileCard={renderAppointmentMobileCard}
        searchPlaceholder="Search by id, doctor/patient id, type, timezone, status..."
        searchFields={(appointment) => [
          String(appointment.appointment_id ?? appointment.id),
          String(appointment.doctor_id ?? ""),
          String(appointment.patient_id ?? ""),
          appointment.type,
          appointment.status,
          appointment.user_timezone,
          appointment.doctor_timezone,
          appointment.notes,
        ]}
        emptyMessage={isLoading ? "Loading appointments..." : "No appointments found"}
      />

      <Card className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-400">
          {isFetching ? "Refreshing..." : "Loaded"} | Page {pagination.page} of{" "}
          {pagination.totalPages} | Total: {pagination.totalItems}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={pagination.page <= 1 || isFetching}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pagination.page >= pagination.totalPages || isFetching}
            onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="p-4 text-sm text-red-400">
          Failed to load appointments. Check API endpoint and auth token.
        </Card>
      )}
    </div>
  );
}
