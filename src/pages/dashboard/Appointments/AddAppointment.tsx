import { useMemo, useState } from "react";
import {
  CalendarPlus,
  Clock,
  FileText,
  Globe,
  Stethoscope,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAppointment } from "@/hooks/useAppointment";
import { useDoctors } from "@/hooks/useDoctor";
import { usePatients } from "@/hooks/usePatient";
import { useToast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const appointmentTypes = [
  "teleconsultation",
  "followup",
  "in_person",
  "emergency",
] as const;

const getLocalDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const detectTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

type AppointmentType = (typeof appointmentTypes)[number];

const appointmentSchema = z.object({
  doctor_id: z.string().min(1, "Select a doctor"),
  patient_id: z.string().min(1, "Select a patient"),
  start_local: z.string().min(1, "Start time is required"),
  duration: z.number().int().min(1, "Duration must be greater than 0"),
  type: z.enum(appointmentTypes),
  notes: z.string().optional(),
  user_timezone: z.string().min(1, "Timezone is required"),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

type SelectOption = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subtitle: string;
  meta?: Record<string, unknown>;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const filterOptions = (options: SelectOption[], query: string, limit: number) => {
  const q = normalizeText(query);
  if (!q) {
    return options.slice(0, limit);
  }
  return options
    .filter((opt) => {
      const hay = `${opt.name} ${opt.email ?? ""} ${opt.subtitle ?? ""}`.toLowerCase();
      return hay.includes(q);
    })
    .slice(0, limit);
};

const extractDoctors = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const row = payload as Record<string, unknown>;
  const candidates = [
    row.data,
    row.doctors,
    row.profiles,
    row.result,
    typeof row.data === "object" && row.data
      ? (row.data as Record<string, unknown>).data
      : undefined,
  ];

  const match = candidates.find((item) => Array.isArray(item));
  return Array.isArray(match) ? match : [];
};

const extractPatients = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const row = payload as Record<string, unknown>;
  const candidates = [
    row.data,
    row.patients,
    row.profiles,
    row.result,
    typeof row.data === "object" && row.data
      ? (row.data as Record<string, unknown>).data
      : undefined,
  ];

  const match = candidates.find((item) => Array.isArray(item));
  return Array.isArray(match) ? match : [];
};

const mapDoctorOption = (doctor: unknown): SelectOption => {
  const row = (doctor ?? {}) as Record<string, unknown>;
  const user = (row.user ?? {}) as Record<string, unknown>;

  return {
    id: String(row.user_id ?? row.userId ?? user.id ?? ""),
    name: String(row.doctor_name ?? row.name ?? user.name ?? "Unnamed Doctor"),
    email: String(user.email ?? row.email ?? ""),
    phone: String(user.phone ?? row.phone ?? ""),
    subtitle:
      [
        String(row.specialization ?? ""),
        String(row.clinic_name ?? row.clinicName ?? ""),
      ]
        .filter(Boolean)
        .join(" | ") || "Doctor profile",
    meta: row,
  };
};

const mapPatientOption = (patient: unknown): SelectOption => {
  const row = (patient ?? {}) as Record<string, unknown>;
  const user = (row.user ?? {}) as Record<string, unknown>;

  return {
    id: String(row.user_id ?? row.userId ?? user.id ?? ""),
    name: String(row.name ?? row.patient_name ?? user.name ?? "Unnamed Patient"),
    email: String(user.email ?? row.email ?? ""),
    phone: String(row.phone ?? user.phone ?? ""),
    subtitle:
      [String(row.consultation_type ?? ""), String(row.phone ?? user.phone ?? "")]
        .filter(Boolean)
        .join(" | ") || "Patient profile",
    meta: row,
  };
};

export default function AddAppointment() {
  const navigate = useNavigate();
  const { mutate: createAppointment, isPending } = useCreateAppointment();
  const { data: doctorsData, isLoading: doctorsLoading } = useDoctors();
  const { data: patientsData, isLoading: patientsLoading } = usePatients();
  const { toast } = useToast();

  const [message, setMessage] = useState<string>("");
  const [doctorQuery, setDoctorQuery] = useState("");
  const [patientQuery, setPatientQuery] = useState("");
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [patientOpen, setPatientOpen] = useState(false);

  const doctorOptions = useMemo(
    () => extractDoctors(doctorsData).map(mapDoctorOption).filter((item) => item.id),
    [doctorsData]
  );

  const patientOptions = useMemo(
    () =>
      extractPatients(patientsData).map(mapPatientOption).filter((item) => item.id),
    [patientsData]
  );

  const filteredDoctors = useMemo(
    () => filterOptions(doctorOptions, doctorQuery, 12),
    [doctorOptions, doctorQuery]
  );

  const filteredPatients = useMemo(
    () => filterOptions(patientOptions, patientQuery, 12),
    [patientOptions, patientQuery]
  );

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctor_id: "",
      patient_id: "",
      start_local: getLocalDateTime(),
      duration: 60,
      type: "teleconsultation",
      notes: "",
      user_timezone: detectTimezone(),
    },
    mode: "onSubmit",
  });

  const selectedDoctor =
    doctorOptions.find((item) => String(item.id) === String(form.watch("doctor_id"))) ??
    null;
  const selectedPatient =
    patientOptions.find((item) => String(item.id) === String(form.watch("patient_id"))) ??
    null;

  const selectedDoctorProfileId = Number((selectedDoctor?.meta as any)?.id ?? 0);
  const selectedPatientProfileId = Number((selectedPatient?.meta as any)?.id ?? 0);

  const rootError = (form.formState.errors as any)?.root?.message as
    | string
    | undefined;

  const onSubmit = (values: AppointmentFormValues) => {
    setMessage("");
    form.clearErrors();

    const localDate = new Date(values.start_local);
    const startUtc = Number.isNaN(localDate.getTime()) ? "" : localDate.toISOString();

    if (!startUtc) {
      const text = "Valid appointment date and time is required.";
      form.setError("start_local", { type: "validate", message: text });
      toast({ title: "Appointment create failed", description: text, variant: "error" });
      return;
    }

    const payload = {
      doctor_id: Number(values.doctor_id || 0),
      patient_id: Number(values.patient_id || 0),
      start_utc: startUtc,
      duration: Number(values.duration || 0),
      type: values.type as AppointmentType,
      notes: values.notes?.trim() || "",
      user_timezone: values.user_timezone.trim() || "UTC",
    };

    createAppointment(payload as any, {
      onSuccess: () => {
        form.reset({
          ...form.getValues(),
          doctor_id: "",
          patient_id: "",
          notes: "",
        });
        setMessage("Appointment created successfully.");
        toast({
          title: "Appointment created",
          description: "New appointment has been added successfully.",
          variant: "success",
        });
        navigate("/admin/appointments/all");
      },
      onError: (error: unknown) => {
        const text = getErrorMessage(error, "Failed to create appointment.");
        form.setError("root", { type: "server", message: text });
        setMessage(text);
        toast({ title: "Appointment create failed", description: text, variant: "error" });
      },
    });
  };

  return (
    <div className="w-full space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Add Appointment</h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="space-y-4 p-4 sm:p-6">
          {rootError && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {rootError}
            </div>
          )}

          <div className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="text-lg font-semibold">Appointment Details</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="doctor_id">Choose Doctor</Label>
                {selectedDoctor && (
                  <button
                    type="button"
                    className="text-xs text-slate-300 hover:text-white cursor-pointer"
                    onClick={() => {
                      form.setValue("doctor_id", "", { shouldValidate: true });
                      setDoctorQuery("");
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {selectedDoctor ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm font-semibold text-slate-100 truncate">
                    {selectedDoctor.name}
                  </p>
                  <p className="text-xs text-slate-300 truncate">
                    {selectedDoctor.email || "--"}
                  </p>
                  <p className="text-xs text-slate-400">{selectedDoctor.subtitle}</p>
                  <p className="text-xs text-slate-400">Doctor ID: {selectedDoctor.id}</p>
                  {selectedDoctorProfileId > 0 &&
                    String(selectedDoctorProfileId) !== String(selectedDoctor.id) && (
                      <p className="text-xs text-slate-400">
                        Profile ID: {selectedDoctorProfileId}
                      </p>
                    )}
                </div>
              ) : (
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="doctor_id"
                    value={doctorQuery}
                    onChange={(e) => {
                      setDoctorQuery(e.target.value);
                      setDoctorOpen(true);
                    }}
                    onFocus={() => setDoctorOpen(true)}
                    onBlur={() => window.setTimeout(() => setDoctorOpen(false), 150)}
                    placeholder={doctorsLoading ? "Loading doctors..." : "Search doctor by name/email..."}
                    className="h-11 rounded-xl border-white/10 bg-slate-900/60 pl-10 text-slate-100 placeholder:text-slate-400"
                  />
                  {doctorOpen && filteredDoctors.length > 0 && (
                    <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 shadow-xl">
                      {filteredDoctors.map((doctor) => (
                        <button
                          key={doctor.id}
                          type="button"
                          className="w-full cursor-pointer px-3 py-2 text-left hover:bg-white/5"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            form.setValue("doctor_id", String(doctor.id), {
                              shouldValidate: true,
                            });
                            setDoctorQuery("");
                            setDoctorOpen(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-100 truncate">
                                {doctor.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {doctor.email || "--"}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {doctor.subtitle}
                              </p>
                            </div>
                            <span className="text-[11px] text-slate-400 shrink-0">
                              #{doctor.id}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {form.formState.errors.doctor_id?.message ? (
                <p className="text-xs text-rose-300">
                  {form.formState.errors.doctor_id.message}
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  {selectedDoctor?.subtitle ??
                    (doctorOptions.length
                      ? "Doctor choose karne ke baad details yahan dikhenge."
                      : "Doctor list available nahi hai.")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="patient_id">Choose Patient</Label>
                {selectedPatient && (
                  <button
                    type="button"
                    className="text-xs text-slate-300 hover:text-white cursor-pointer"
                    onClick={() => {
                      form.setValue("patient_id", "", { shouldValidate: true });
                      setPatientQuery("");
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {selectedPatient ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm font-semibold text-slate-100 truncate">
                    {selectedPatient.name}
                  </p>
	                  <p className="text-xs text-slate-300 truncate">
	                    {selectedPatient.email || "--"}
	                  </p>
                  <p className="text-xs text-slate-400">{selectedPatient.subtitle}</p>
                  <p className="text-xs text-slate-400">
                    Patient ID: {selectedPatient.id}
                  </p>
                  {selectedPatientProfileId > 0 &&
                    String(selectedPatientProfileId) !== String(selectedPatient.id) && (
                      <p className="text-xs text-slate-400">
                        Profile ID: {selectedPatientProfileId}
                      </p>
                    )}
                </div>
              ) : (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="patient_id"
                    value={patientQuery}
                    onChange={(e) => {
                      setPatientQuery(e.target.value);
                      setPatientOpen(true);
                    }}
                    onFocus={() => setPatientOpen(true)}
                    onBlur={() => window.setTimeout(() => setPatientOpen(false), 150)}
                    placeholder={patientsLoading ? "Loading patients..." : "Search patient by name/email..."}
                    className="h-11 rounded-xl border-white/10 bg-slate-900/60 pl-10 text-slate-100 placeholder:text-slate-400"
                  />
                  {patientOpen && filteredPatients.length > 0 && (
                    <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 shadow-xl">
                      {filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          className="w-full cursor-pointer px-3 py-2 text-left hover:bg-white/5"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            form.setValue("patient_id", String(patient.id), {
                              shouldValidate: true,
                            });
                            setPatientQuery("");
                            setPatientOpen(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-100 truncate">
                                {patient.name}
                              </p>
	                              <p className="text-xs text-slate-400 truncate">
	                                {patient.email || "--"}
	                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {patient.subtitle}
                              </p>
                            </div>
                            <span className="text-[11px] text-slate-400 shrink-0">
                              #{patient.id}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {form.formState.errors.patient_id?.message ? (
                <p className="text-xs text-rose-300">
                  {form.formState.errors.patient_id.message}
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  {selectedPatient?.subtitle ??
                    (patientOptions.length
                      ? "Patient choose karne ke baad details yahan dikhenge."
                      : "Patient list available nahi hai.")}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Selected doctor
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-100">
                    {selectedDoctor?.name ?? "No doctor selected"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedDoctor
                      ? `Doctor ID: ${selectedDoctor.id}`
                      : "Doctor ID payload me yahi jayegi."}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Selected patient
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-100">
                    {selectedPatient?.name ?? "No patient selected"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedPatient
                      ? `Patient ID: ${selectedPatient.id}`
                      : "Patient ID payload me yahi jayegi."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_local">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="start_local"
                  type="datetime-local"
                  className="h-11 rounded-xl border-white/10 bg-slate-900/60 pl-10 text-slate-100"
                  {...form.register("start_local")}
                />
              </div>
              {form.formState.errors.start_local?.message && (
                <p className="text-xs text-rose-300">
                  {form.formState.errors.start_local.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  className="h-11 rounded-xl border-white/10 bg-slate-900/60 pl-10 text-slate-100"
                  {...form.register("duration", { valueAsNumber: true })}
                />
              </div>
              {form.formState.errors.duration?.message && (
                <p className="text-xs text-rose-300">
                  {form.formState.errors.duration.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/60 cursor-pointer"
                {...form.register("type")}
              >
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {form.formState.errors.type?.message && (
                <p className="text-xs text-rose-300">{form.formState.errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_timezone">User Timezone</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="user_timezone"
                  placeholder="America/New_York"
                  className="h-11 rounded-xl border-white/10 bg-slate-900/60 pl-10 text-slate-100 placeholder:text-slate-400"
                  {...form.register("user_timezone")}
                />
              </div>
              {form.formState.errors.user_timezone?.message && (
                <p className="text-xs text-rose-300">
                  {form.formState.errors.user_timezone.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  id="notes"
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 pl-10 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/60"
                  {...form.register("notes")}
                />
              </div>
            </div>
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-emerald-300"
                  : "text-rose-300"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700"
          >
            {isPending ? "Creating..." : "Create Appointment"}
          </Button>
        </Card>
      </form>
    </div>
  );
}
