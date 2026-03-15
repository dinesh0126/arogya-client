import { useCallback, useMemo, useState } from "react";
import { Calendar, Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { RecordsOverview, type RecordColumn } from "@/components/dashboard/RecordsOverview";
import {
  useAppointments,
  useCancelAppointment,
  useRescheduleAppointment,
} from "@/hooks/useAppointment";
import type { AppointmentRecord } from "@/types/appointment";

type AppointmentStatusFilter = "all" | "confirmed" | "cancelled" | "rescheduled";

const STATUS_OPTIONS: AppointmentStatusFilter[] = [
  "all",
  "confirmed",
  "cancelled",
  "rescheduled",
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
  if (normalized.includes("resched")) {
    return "text-purple-400 bg-purple-400/10 border border-purple-400/30";
  }
  if (normalized.includes("cancel")) {
    return "text-red-400 bg-red-400/10 border border-red-400/30";
  }
  return "text-gray-300 bg-gray-500/10 border border-gray-400/30";
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
};

export default function AllAppointments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatusFilter>("all");
  const [activeAppointment, setActiveAppointment] = useState<AppointmentRecord | null>(
    null
  );
  const [actionType, setActionType] = useState<"cancel" | "reschedule" | null>(
    null
  );
  const [cancelUserId, setCancelUserId] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const apiStatus = statusFilter === "all" ? undefined : statusFilter;
  const { data, isLoading, isFetching, error } = useAppointments({
    page,
    limit,
    status: apiStatus,
  });
  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();

  const cancelSchema = useMemo(
    () =>
      z.object({
        user_id: z
          .coerce
          .number()
          .int("User id must be a whole number.")
          .positive("User id must be greater than 0.")
          .refine((value) => Number.isFinite(value), {
            message: "User id must be a number.",
          }),
      }),
    []
  );

  const rescheduleSchema = useMemo(
    () =>
      z.object({
        date: z
          .string()
          .min(1, "Date is required.")
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD."),
        time_slot: z
          .string()
          .min(1, "Time is required.")
          .regex(
            /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
            "Time must be HH:MM or HH:MM:SS."
          ),
      }),
    []
  );

  const toDateInput = useCallback((isoDate: string) => {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) {
      return "";
    }
    return parsed.toISOString().slice(0, 10);
  }, []);

  const toTimeInput = useCallback((isoDate: string) => {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) {
      return "";
    }
    return parsed.toISOString().slice(11, 16);
  }, []);

  const openCancel = useCallback((appointment: AppointmentRecord) => {
    setActiveAppointment(appointment);
    setActionType("cancel");
    setCancelUserId(
      appointment.patient_id ? String(appointment.patient_id) : "1"
    );
    setRescheduleDate("");
    setRescheduleTime("");
    setActionError(null);
    setFieldErrors({});
  }, []);

  const openReschedule = useCallback((appointment: AppointmentRecord) => {
    setActiveAppointment(appointment);
    setActionType("reschedule");
    setRescheduleDate(toDateInput(appointment.start_utc));
    setRescheduleTime(toTimeInput(appointment.start_utc));
    setCancelUserId("");
    setActionError(null);
    setFieldErrors({});
  }, [toDateInput, toTimeInput]);

  const closeAction = () => {
    setActiveAppointment(null);
    setActionType(null);
    setCancelUserId("");
    setRescheduleDate("");
    setRescheduleTime("");
    setActionError(null);
    setFieldErrors({});
  };

  const handleCancel = async () => {
    if (!activeAppointment) return;
    const userIdNumber = Number(cancelUserId);
    const parsed = cancelSchema.safeParse({ user_id: userIdNumber });
    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        user_id: issues.user_id?.[0] ?? "Please enter a valid user id.",
      });
      toast({
        title: "Cancel failed",
        description: issues.user_id?.[0] ?? "Please enter a valid user id.",
        variant: "error",
      });
      return;
    }
    const appointmentId = activeAppointment.appointment_id ?? activeAppointment.id;
    try {
      setActionError(null);
      setFieldErrors({});
      await cancelMutation.mutateAsync({
        appointmentId,
        payload: { user_id: parsed.data.user_id },
      });
      toast({ title: "Appointment cancelled" });
      closeAction();
    } catch (err) {
      const message = getErrorMessage(err, "Cancel failed. Please try again.");
      setActionError(message);
      toast({ title: "Cancel failed", description: message, variant: "error" });
    }
  };

  const handleReschedule = async () => {
    if (!activeAppointment) return;
    const appointmentId = activeAppointment.appointment_id ?? activeAppointment.id;
    const timeSlot = rescheduleTime.length === 5 ? `${rescheduleTime}:00` : rescheduleTime;
    const parsed = rescheduleSchema.safeParse({
      date: rescheduleDate,
      time_slot: timeSlot,
    });
    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        date: issues.date?.[0] ?? "",
        time_slot: issues.time_slot?.[0] ?? "",
      });
      toast({
        title: "Reschedule failed",
        description: issues.date?.[0] ?? issues.time_slot?.[0] ?? "Invalid data.",
        variant: "error",
      });
      return;
    }
    try {
      setActionError(null);
      setFieldErrors({});
      await rescheduleMutation.mutateAsync({
        appointmentId,
        payload: parsed.data,
      });
      toast({ title: "Appointment rescheduled" });
      closeAction();
    } catch (err) {
      const message = getErrorMessage(err, "Reschedule failed. Please try again.");
      setActionError(message);
      toast({ title: "Reschedule failed", description: message, variant: "error" });
    }
  };

  const renderAppointmentMobileCard = useCallback(
    (appointment: AppointmentRecord) => (
      <Card className="p-3 sm:p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Appointment #{appointment.appointment_id ?? appointment.id}
              </p>
              <p className="text-xs text-gray-300 truncate">
                {appointment.doctor_name} - {appointment.patient_name}
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
            <p>
              User Slot: {appointment.start_user || "--"} - {appointment.end_user || "--"}
            </p>
            <p>Timezone: {appointment.user_timezone || "--"}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => openReschedule(appointment)}
            >
              Reschedule
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => openCancel(appointment)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    ),
    [openCancel, openReschedule]
  );

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
            <span className="text-white font-medium">
              {appointment.doctor_name}
            </span>
            <span className="text-gray-400">{appointment.patient_name}</span>
            <span className="text-gray-500">
              IDs: {appointment.doctor_id ?? "--"} / {appointment.patient_id ?? "--"}
            </span>
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
      {
        id: "actions",
        header: "Actions",
        render: (appointment) => (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => openReschedule(appointment)}
            >
              Reschedule
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => openCancel(appointment)}
            >
              Cancel
            </Button>
          </div>
        ),
      },
    ],
    [openCancel, openReschedule]
  );

  return (
    <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">All Appointments</h1>
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

      {actionType && activeAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-6"
          onClick={closeAction}
        >
          <Card
            className="w-full max-w-xl p-4 sm:p-6 border border-white/10 bg-slate-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-300">
                    Appointment #{activeAppointment.appointment_id ?? activeAppointment.id}
                  </p>
                  <p className="text-lg font-semibold">
                    {activeAppointment.doctor_name} - {activeAppointment.patient_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Current slot: {formatUtcDate(activeAppointment.start_utc)}
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={closeAction}>
                  Close
                </Button>
              </div>

              {actionType === "cancel" ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">User ID</label>
                    <Input
                      type="number"
                      value={cancelUserId}
                      onChange={(event) => {
                        setCancelUserId(event.target.value);
                        setFieldErrors((prev) => ({ ...prev, user_id: "" }));
                      }}
                      placeholder="Enter user id"
                    />
                    {fieldErrors.user_id && (
                      <p className="text-xs text-red-400">{fieldErrors.user_id}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleCancel}
                      disabled={cancelMutation.isPending}
                    >
                      {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancel"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400">Date</label>
                      <Input
                        type="date"
                        value={rescheduleDate}
                        onChange={(event) => {
                          setRescheduleDate(event.target.value);
                          setFieldErrors((prev) => ({ ...prev, date: "" }));
                        }}
                      />
                      {fieldErrors.date && (
                        <p className="text-xs text-red-400">{fieldErrors.date}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400">Time</label>
                      <Input
                        type="time"
                        value={rescheduleTime}
                        onChange={(event) => {
                          setRescheduleTime(event.target.value);
                          setFieldErrors((prev) => ({ ...prev, time_slot: "" }));
                        }}
                      />
                      {fieldErrors.time_slot && (
                        <p className="text-xs text-red-400">{fieldErrors.time_slot}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={handleReschedule}
                      disabled={rescheduleMutation.isPending}
                    >
                      {rescheduleMutation.isPending ? "Saving..." : "Save Reschedule"}
                    </Button>
                  </div>
                </div>
              )}

              {actionError && <p className="text-xs text-red-400">{actionError}</p>}
            </div>
          </Card>
        </div>
      )}

      <RecordsOverview
        title="Appointments"
        description={`Filtered by status: ${apiStatus ?? "all"}`}
        items={appointments}
        getRowId={(appointment) => appointment.id}
        columns={appointmentColumns}
        mobileCard={renderAppointmentMobileCard}
        searchPlaceholder="Search by id, doctor/patient, type, timezone, status..."
        searchFields={(appointment) => [
          String(appointment.appointment_id ?? appointment.id),
          String(appointment.doctor_id ?? ""),
          String(appointment.patient_id ?? ""),
          appointment.doctor_name,
          appointment.patient_name,
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
