import { useState } from "react";
import { CalendarPlus, Clock, FileText, Globe, Stethoscope, User } from "lucide-react";
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

const appointmentTypes = ["teleconsultation", "followup", "in_person", "emergency"];

const getInitialFormState = () => ({
  doctor_id: "",
  patient_id: "",
  start_local: getLocalDateTime(),
  duration: "60",
  type: "teleconsultation",
  notes: "",
  user_timezone: detectTimezone(),
});

const getLocalDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const detectTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

type SelectOption = {
  id: string;
  name: string;
  subtitle: string;
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
    subtitle:
      [
        String(row.specialization ?? ""),
        String(row.clinic_name ?? row.clinicName ?? ""),
      ]
        .filter(Boolean)
        .join(" | ") || "Doctor profile",
  };
};

const mapPatientOption = (patient: unknown): SelectOption => {
  const row = (patient ?? {}) as Record<string, unknown>;
  const user = (row.user ?? {}) as Record<string, unknown>;

  return {
    id: String(row.user_id ?? row.userId ?? user.id ?? ""),
    name: String(row.name ?? row.patient_name ?? user.name ?? "Unnamed Patient"),
    subtitle:
      [
        String(row.consultation_type ?? ""),
        String(row.phone ?? user.phone ?? ""),
      ]
        .filter(Boolean)
        .join(" | ") || "Patient profile",
  };
};

export default function AddAppointment() {
  const navigate = useNavigate();
  const { mutate: createAppointment, isPending } = useCreateAppointment();
  const { data: doctorsData, isLoading: doctorsLoading } = useDoctors();
  const { data: patientsData, isLoading: patientsLoading } = usePatients();
  const { toast } = useToast();

  const [formData, setFormData] = useState(getInitialFormState);

  const [message, setMessage] = useState("");
  const doctorOptions = extractDoctors(doctorsData).map(mapDoctorOption).filter((item) => item.id);
  const patientOptions =
    extractPatients(patientsData).map(mapPatientOption).filter((item) => item.id);
  const selectedDoctor =
    doctorOptions.find((item) => String(item.id) === formData.doctor_id) ?? null;
  const selectedPatient =
    patientOptions.find((item) => String(item.id) === formData.patient_id) ?? null;

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const localDate = new Date(formData.start_local);
    const startUtc = Number.isNaN(localDate.getTime()) ? "" : localDate.toISOString();

    const payload = {
      doctor_id: Number(formData.doctor_id || 0),
      patient_id: Number(formData.patient_id || 0),
      start_utc: startUtc,
      duration: Number(formData.duration || 0),
      type: formData.type,
      notes: formData.notes.trim(),
      user_timezone: formData.user_timezone.trim() || "UTC",
    };

    if (!payload.doctor_id || !payload.patient_id) {
      const text = "doctor_id and patient_id are required.";
      setMessage(text);
      toast({ title: "Appointment create failed", description: text, variant: "error" });
      return;
    }

    if (!payload.start_utc) {
      const text = "Valid appointment date and time is required.";
      setMessage(text);
      toast({ title: "Appointment create failed", description: text, variant: "error" });
      return;
    }

    if (!payload.duration || payload.duration <= 0) {
      const text = "Duration must be greater than 0.";
      setMessage(text);
      toast({ title: "Appointment create failed", description: text, variant: "error" });
      return;
    }

    createAppointment(payload, {
      onSuccess: () => {
        setFormData(getInitialFormState());
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

      <form onSubmit={handleSubmit}>
        <Card className="space-y-4 p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold">Appointment Details</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="doctor_id">Choose Doctor</Label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <select
                  id="doctor_id"
                  value={formData.doctor_id}
                  onChange={(event) => handleChange("doctor_id", event.target.value)}
                  className="w-full rounded-md border border-input bg-card py-2 pl-10 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  required
                >
                  <option value="">
                    {doctorsLoading ? "Loading doctors..." : "Select doctor"}
                  </option>
                  {doctorOptions.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.id})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-400">
                {selectedDoctor?.subtitle ??
                  (doctorOptions.length
                      ? "Doctor choose karne ke baad details yahan dikhenge."
                      : "Doctor list available nahi hai.")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient_id">Choose Patient</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <select
                  id="patient_id"
                  value={formData.patient_id}
                  onChange={(event) => handleChange("patient_id", event.target.value)}
                  className="w-full rounded-md border border-input bg-card py-2 pl-10 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  required
                >
                  <option value="">
                    {patientsLoading ? "Loading patients..." : "Select patient"}
                  </option>
                  {patientOptions.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-400">
                {selectedPatient?.subtitle ??
                  (patientOptions.length
                    ? "Patient choose karne ke baad details yahan dikhenge."
                    : "Patient list available nahi hai.")}
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="grid gap-3 rounded-lg border border-border bg-muted/40 p-3 sm:grid-cols-2">
                <div className="rounded-md border border-border bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Selected doctor</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {selectedDoctor?.name ?? "No doctor selected"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedDoctor
                      ? `Doctor ID: ${selectedDoctor.id}`
                      : "Doctor ID payload me yahi jayegi."}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Selected patient</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {selectedPatient?.name ?? "No patient selected"}
                  </p>
                  <p className="text-xs text-gray-400">
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
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="start_local"
                  type="datetime-local"
                  value={formData.start_local}
                  onChange={(event) => handleChange("start_local", event.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={formData.duration}
                  onChange={(event) => handleChange("duration", event.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(event) => handleChange("type", event.target.value)}
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
              >
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_timezone">User Timezone</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="user_timezone"
                  placeholder="America/New_York"
                  value={formData.user_timezone}
                  onChange={(event) => handleChange("user_timezone", event.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(event) => handleChange("notes", event.target.value)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 pl-10 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.toLowerCase().includes("success") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer bg-green-600 hover:bg-green-700"
          >
            {isPending ? "Creating..." : "Create Appointment"}
          </Button>
        </Card>
      </form>
    </div>
  );
}
