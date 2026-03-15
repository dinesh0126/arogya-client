import { api } from "./axios";
import type {
  AppointmentListResponse,
  AppointmentPagination,
  AppointmentRecord,
  CreateAppointmentPayload,
  CancelAppointmentPayload,
  RescheduleAppointmentPayload,
} from "@/types/appointment";

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" ? (value as UnknownRecord) : {};

const asNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const asString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return fallback;
};

const extractItems = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const data = asRecord(payload);
  const nestedData = data.data;
  const nestedDataRecord = asRecord(nestedData);

  const candidates: unknown[] = [
    data.data,
    data.appointments,
    data.rows,
    data.result,
    data.items,
    nestedData,
    nestedDataRecord.appointments,
    nestedDataRecord.rows,
    nestedDataRecord.result,
    nestedDataRecord.items,
  ];

  const match = candidates.find((item) => Array.isArray(item));
  return Array.isArray(match) ? match : [];
};

const extractPagination = (
  payload: unknown,
  fallbackPage: number,
  fallbackLimit: number,
  itemCount: number
): AppointmentPagination => {
  const data = asRecord(payload);
  const nestedData = asRecord(data.data);
  const pagination = asRecord(data.pagination);
  const nestedPagination = asRecord(nestedData.pagination);
  const meta = asRecord(data.meta);
  const nestedMeta = asRecord(nestedData.meta);

  const page =
    asNumber(pagination.page) ||
    asNumber(nestedPagination.page) ||
    asNumber(meta.page) ||
    asNumber(nestedMeta.page) ||
    asNumber(data.page) ||
    asNumber(nestedData.page) ||
    fallbackPage;

  const limit =
    asNumber(pagination.limit) ||
    asNumber(nestedPagination.limit) ||
    asNumber(meta.limit) ||
    asNumber(nestedMeta.limit) ||
    asNumber(data.limit) ||
    asNumber(nestedData.limit) ||
    fallbackLimit;

  const totalItems =
    asNumber(pagination.totalItems) ||
    asNumber(nestedPagination.totalItems) ||
    asNumber(pagination.total) ||
    asNumber(nestedPagination.total) ||
    asNumber(meta.totalItems) ||
    asNumber(nestedMeta.totalItems) ||
    asNumber(meta.total) ||
    asNumber(nestedMeta.total) ||
    asNumber(data.totalItems) ||
    asNumber(data.total) ||
    asNumber(nestedData.totalItems) ||
    asNumber(nestedData.total) ||
    itemCount;

  const totalPages =
    asNumber(pagination.totalPages) ||
    asNumber(nestedPagination.totalPages) ||
    asNumber(meta.total_pages) ||
    asNumber(nestedMeta.total_pages) ||
    asNumber(meta.totalPages) ||
    asNumber(nestedMeta.totalPages) ||
    asNumber(data.totalPages) ||
    asNumber(nestedData.totalPages) ||
    Math.max(1, Math.ceil(totalItems / Math.max(limit, 1)));

  return {
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    totalItems: Math.max(0, totalItems),
    totalPages: Math.max(1, totalPages),
  };
};

const mapAppointment = (appointment: unknown): AppointmentRecord => {
  const row = asRecord(appointment);
  const doctor = asRecord(row.doctor);
  const patient = asRecord(row.patient);
  const slot = asRecord(row.slot);
  const timezone = asRecord(row.timezone);

  const id =
    asString(row.id) ||
    asString(row.appointment_id) ||
    `${asString(row.start_utc, "appointment")}-${asString(row.doctor_id, "0")}`;

  return {
    id,
    appointment_id: asNumber(row.appointment_id, NaN) || asNumber(row.id, NaN) || null,
    doctor_id: asNumber(row.doctor_id, NaN) || asNumber(doctor.id, NaN) || null,
    patient_id: asNumber(row.patient_id, NaN) || asNumber(patient.id, NaN) || null,
    doctor_name: asString(row.doctor_name) || asString(doctor.name, "Doctor"),
    patient_name: asString(row.patient_name) || asString(patient.name, "Patient"),
    start_utc:
      asString(slot.start_utc) || asString(row.start_utc) || asString(row.startUtc),
    end_utc: asString(slot.end_utc),
    start_user: asString(slot.start_user),
    end_user: asString(slot.end_user),
    start_doctor: asString(slot.start_doctor),
    end_doctor: asString(slot.end_doctor),
    duration: asNumber(row.duration),
    type: asString(row.type, "consultation"),
    notes: asString(row.notes),
    user_timezone:
      asString(timezone.user) || asString(row.user_timezone) || asString(row.userTimezone),
    doctor_timezone: asString(timezone.doctor) || asString(row.doctor_timezone),
    meeting_link: asString(row.meeting_link),
    created_at: asString(row.created_at),
    status: asString(row.status, "Scheduled"),
  };
};

export const createAppointmentApi = async (payload: CreateAppointmentPayload) => {
  try {
    const res = await api.post("/admin/appointments", payload);
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 404 || err.response?.status === 405) {
      try {
        const fallbackRes = await api.post("/appointment/booking", payload);
        return fallbackRes.data;
      } catch (fallbackError: unknown) {
        const fallbackErr = fallbackError as { response?: { status?: number } };
        if (fallbackErr.response?.status === 404 || fallbackErr.response?.status === 405) {
          const secondaryFallback = await api.post("/admin/createappointment", payload);
          return secondaryFallback.data;
        }
        throw fallbackError;
      }
    }
    throw error;
  }
};

export const fetchAllAppointmentsApi = async ({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<AppointmentListResponse> => {
  let responseData: unknown;

  try {
    const res = await api.get("/appointment", {
      params: { page, limit, ...(status ? { status } : {}) },
    });
    responseData = res.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 404 || err.response?.status === 405) {
      const fallback = await api.get("/admin/getappointments", {
        params: { page, limit, ...(status ? { status } : {}) },
      });
      responseData = fallback.data;
    } else {
      throw error;
    }
  }

  const items = extractItems(responseData).map(mapAppointment);
  const pagination = extractPagination(responseData, page, limit, items.length);

  return {
    items,
    pagination,
    raw: responseData,
  };
};

export const cancelAppointmentApi = async (
  appointmentId: string | number,
  payload: CancelAppointmentPayload
) => {
  const res = await api.patch(`/appointment/${appointmentId}/cancel`, payload);
  return res.data;
};

export const rescheduleAppointmentApi = async (
  appointmentId: string | number,
  payload: RescheduleAppointmentPayload
) => {
  const res = await api.put(
    `/appointment/${appointmentId}/reschedule`,
    payload
  );
  return res.data;
};
