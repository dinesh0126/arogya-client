import { useState } from "react";
import { CalendarPlus, Clock, FileText, Globe, Stethoscope, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAppointment } from "@/hooks/useAppointment";

const appointmentTypes = [
  "teleconsultation",
  "followup",
  "in_person",
  "emergency",
];

const getLocalDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const detectTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function AddAppointment() {
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const [formData, setFormData] = useState({
    doctor_id: "",
    patient_id: "",
    start_local: getLocalDateTime(),
    duration: "60",
    type: "teleconsultation",
    notes: "First consultation",
    user_timezone: detectTimezone(),
  });

  const [message, setMessage] = useState<string>("");

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
    const startUtc = Number.isNaN(localDate.getTime())
      ? ""
      : localDate.toISOString();

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
      setMessage("doctor_id and patient_id are required.");
      return;
    }

    if (!payload.start_utc) {
      setMessage("Valid appointment date and time is required.");
      return;
    }

    if (!payload.duration || payload.duration <= 0) {
      setMessage("Duration must be greater than 0.");
      return;
    }

    createAppointment(payload, {
      onSuccess: () => {
        setMessage("Appointment created successfully.");
      },
      onError: (error: unknown) => {
        const apiError = error as { response?: { data?: { message?: string } } };
        setMessage(apiError?.response?.data?.message || "Failed to create appointment.");
      },
    });
  };

  return (
    <div className="w-full space-y-6 px-2 sm:px-4 lg:px-6 xl:px-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Add Appointment</h1>
        <p className="text-sm text-gray-400">
          Admin can create appointment using doctor_id and patient_id.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold">Appointment Details</h2>
              <p className="text-sm text-gray-400">Fill values as per API payload.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="doctor_id">Doctor ID</Label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="doctor_id"
                  type="number"
                  min={1}
                  placeholder="1"
                  value={formData.doctor_id}
                  onChange={(event) => handleChange("doctor_id", event.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient_id">Patient ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="patient_id"
                  type="number"
                  min={1}
                  placeholder="1"
                  value={formData.patient_id}
                  onChange={(event) => handleChange("patient_id", event.target.value)}
                  className="pl-10"
                  required
                />
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
                className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
              >
                {appointmentTypes.map((type) => (
                  <option key={type} value={type} className="bg-slate-900">
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
                  className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 pl-10 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 cursor-pointer"
          >
            {isPending ? "Creating..." : "Create Appointment"}
          </Button>
        </Card>
      </form>
    </div>
  );
}
