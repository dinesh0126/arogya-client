export interface CreateAppointmentPayload {
  doctor_id: number;
  patient_id: number;
  start_utc: string;
  duration: number;
  type: string;
  notes?: string;
  user_timezone: string;
}

export interface AppointmentRecord {
  id: string;
  appointment_id: number | null;
  doctor_id: number | null;
  patient_id: number | null;
  doctor_name: string;
  patient_name: string;
  start_utc: string;
  end_utc: string;
  start_user: string;
  end_user: string;
  start_doctor: string;
  end_doctor: string;
  duration: number;
  type: string;
  notes: string;
  user_timezone: string;
  doctor_timezone: string;
  meeting_link: string;
  created_at: string;
  status: string;
}

export interface AppointmentPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface AppointmentListResponse {
  items: AppointmentRecord[];
  pagination: AppointmentPagination;
  raw: unknown;
}

export interface AppointmentBookingOption {
  id: number;
  name: string;
  subtitle: string;
}

export interface AppointmentBookingOptionsResponse {
  doctors: AppointmentBookingOption[];
  patients: AppointmentBookingOption[];
  raw: unknown;
}
